# VieroMind

Mental Health & AI Platform — plain HTML/CSS/JS + Express.js backend.

## Local Development
```bash
npm install
cp .env.example .env
# Edit .env → add GROQ_API_KEY
npm run dev
```
Visit http://localhost:3000

## Deploy to Vercel
1. Push this folder to a GitHub repo
2. Import the repo on vercel.com
3. In Vercel → Project Settings → Environment Variables, add:
   - `GROQ_API_KEY` = your key from https://console.groq.com
   - `SESSION_SECRET` = any random string

That's it. The `vercel.json` handles routing automatically.

## Notes
- User accounts and chat history are stored in memory.
  They reset when the server restarts (Vercel cold start).
  For persistent storage, connect a database (e.g. Vercel Postgres).
