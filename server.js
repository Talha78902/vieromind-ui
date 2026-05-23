require("dotenv").config();
const express      = require("express");
const cors         = require("cors");
const path         = require("path");
const https        = require("https");
const crypto       = require("crypto");
const cookieSession = require("cookie-session");

const app = express();
app.use(cors());
app.use(express.json());

// ── Cookie-session: works on Vercel (no filesystem, no persistent store needed) ──
app.use(cookieSession({
  name: "vieromind_session",
  secret: process.env.SESSION_SECRET || "vieromind-secret-2025",
  maxAge: 7 * 24 * 60 * 60 * 1000,   // 7 days
  secure: false,                        // allow http in dev; Vercel serves https so fine
  sameSite: "lax"
}));

// Serve static files. On Vercel the CWD is the project root.
app.use(express.static(path.join(__dirname, "public")));

// ── In-memory stores (resets on cold start, fine for demo / small apps) ──────
// Map<username_lower, { id, username, passwordHash, createdAt }>
const USERS = new Map();
// Map<userId, { group:[], nova:[], luna:[], rex:[], zara:[] }>
const CHATS = new Map();

function hashPw(pw) {
  return crypto.createHash("sha256").update(pw + "viero_salt_2025").digest("hex");
}
function getChats(uid) {
  if (!CHATS.has(uid)) CHATS.set(uid, { group:[], nova:[], luna:[], rex:[], zara:[] });
  return CHATS.get(uid);
}

// ── Auth middleware ───────────────────────────────────────────────────────────
function requireAuth(req, res, next) {
  if (req.session && req.session.userId) return next();
  return res.status(401).json({ error: "Not authenticated" });
}

// ── Auth routes ───────────────────────────────────────────────────────────────
app.post("/api/auth/register", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password)  return res.status(400).json({ error: "Username and password required" });
  if (username.length < 3)     return res.status(400).json({ error: "Username must be at least 3 characters" });
  if (password.length < 6)     return res.status(400).json({ error: "Password must be at least 6 characters" });
  const key = username.toLowerCase();
  if (USERS.has(key))          return res.status(409).json({ error: "Username already taken" });
  const user = { id: crypto.randomUUID(), username, passwordHash: hashPw(password), createdAt: new Date().toISOString() };
  USERS.set(key, user);
  req.session.userId   = user.id;
  req.session.username = user.username;
  res.json({ ok: true, username: user.username });
});

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: "Username and password required" });
  const user = USERS.get(username.toLowerCase());
  if (!user || user.passwordHash !== hashPw(password))
    return res.status(401).json({ error: "Invalid username or password" });
  req.session.userId   = user.id;
  req.session.username = user.username;
  res.json({ ok: true, username: user.username });
});

app.post("/api/auth/logout", (req, res) => {
  req.session = null;
  res.json({ ok: true });
});

app.get("/api/auth/me", (req, res) => {
  if (req.session && req.session.userId)
    return res.json({ loggedIn: true, username: req.session.username });
  res.json({ loggedIn: false });
});

// ── Chat routes ───────────────────────────────────────────────────────────────
app.get("/api/chats", requireAuth, (req, res) => {
  res.json(getChats(req.session.userId));
});

app.post("/api/chats", requireAuth, (req, res) => {
  const { chats } = req.body || {};
  if (!chats) return res.status(400).json({ error: "No chats provided" });
  CHATS.set(req.session.userId, chats);
  res.json({ ok: true });
});

app.delete("/api/chats", requireAuth, (req, res) => {
  CHATS.set(req.session.userId, { group:[], nova:[], luna:[], rex:[], zara:[] });
  res.json({ ok: true });
});

// ── Groq ─────────────────────────────────────────────────────────────────────
const PERSONAS = {
  nova: `You are Nova — razor-sharp analytical AI. Precise, logical, data-driven. Under 80 words. Stay in character as Nova.`,
  luna: `You are Luna — warm, empathetic AI. Gentle, poetic language, emotional insight. Under 80 words. Stay in character as Luna.`,
  rex:  `You are Rex — blunt, bold, no-nonsense. Direct, dry humor, short punchy sentences. Under 80 words. Stay in character as Rex.`,
  zara: `You are Zara — creative, philosophical. Metaphors, big ideas, enthusiastic. Under 80 words. Stay in character as Zara.`,
};

function groqRequest(messages) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ model: "llama-3.1-8b-instant", max_tokens: 200, messages });
    const req = https.request({
      hostname: "api.groq.com",
      path: "/openai/v1/chat/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Length": Buffer.byteLength(data),
      },
    }, (res) => {
      let raw = "";
      res.on("data", c => raw += c);
      res.on("end", () => {
        try {
          const p = JSON.parse(raw);
          if (res.statusCode >= 200 && res.statusCode < 300) resolve(p);
          else reject(new Error(`Groq ${res.statusCode}: ${p?.error?.message || raw}`));
        } catch(e) { reject(new Error("Parse error: " + raw.slice(0,200))); }
      });
    });
    req.on("error", e => reject(new Error("Network: " + e.message)));
    req.write(data); req.end();
  });
}

app.get("/api/test", async (req, res) => {
  if (!process.env.GROQ_API_KEY) return res.json({ ok: false, error: "GROQ_API_KEY missing from environment variables" });
  try {
    const d = await groqRequest([{ role:"system", content:"You are a test bot." }, { role:"user", content:"Say: API connection successful." }]);
    res.json({ ok: true, response: d.choices?.[0]?.message?.content });
  } catch(e) { res.json({ ok: false, error: e.message }); }
});

app.post("/api/chat", requireAuth, async (req, res) => {
  const { persona, messages } = req.body || {};
  if (!process.env.GROQ_API_KEY) return res.status(500).json({ error: "GROQ_API_KEY missing — add it in Vercel Environment Variables" });
  if (!PERSONAS[persona])        return res.status(400).json({ error: "Unknown persona: " + persona });
  try {
    const d = await groqRequest([{ role:"system", content:PERSONAS[persona] }, ...(messages||[])]);
    res.json({ text: d.choices?.[0]?.message?.content || "" });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Page routes ───────────────────────────────────────────────────────────────
app.get("/login",            (req,res) => res.sendFile(path.join(__dirname,"public","login.html")));
app.get("/mbti",             (req,res) => res.sendFile(path.join(__dirname,"public","mbti.html")));
app.get("/therapist-finder", (req,res) => res.sendFile(path.join(__dirname,"public","therapist-finder.html")));
app.get("/multi-ai-chat",    (req,res) => res.sendFile(path.join(__dirname,"public","multi-ai-chat.html")));
app.get("/",                 (req,res) => res.sendFile(path.join(__dirname,"public","index.html")));

// ── Local dev server (not used by Vercel) ────────────────────────────────────
if (process.env.NODE_ENV !== "production" || process.env.FORCE_LOCAL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`\n  VieroMind → http://localhost:${PORT}`);
    console.log(`  Groq key  : ${process.env.GROQ_API_KEY ? "✓ found" : "✗ MISSING"}\n`);
  });
}

module.exports = app;
