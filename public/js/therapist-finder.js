// Therapist data embedded directly — no server fetch needed (works on any deployment)
var THERAPIST_DATA = [
  {name:"Dr. Sarah Mitchell",   specialty:"Anxiety & Depression",      country:"United States", language:"English",            rating:"4.9", experience:"12", sessions:"1200", online:"true",  photo:"S"},
  {name:"Dr. Ahmad Raza",       specialty:"Cognitive Behavioral Therapy",country:"Pakistan",    language:"English|Urdu",       rating:"4.8", experience:"9",  sessions:"870",  online:"true",  photo:"A"},
  {name:"Dr. Emily Chen",       specialty:"Trauma & PTSD",             country:"Canada",        language:"English|Mandarin",   rating:"4.9", experience:"15", sessions:"2100", online:"true",  photo:"E"},
  {name:"Dr. Fatima Al-Zahra",  specialty:"Family Therapy",            country:"UAE",           language:"Arabic|English",     rating:"4.7", experience:"8",  sessions:"650",  online:"true",  photo:"F"},
  {name:"Dr. James Okafor",     specialty:"Depression & Anxiety",      country:"Nigeria",       language:"English",            rating:"4.8", experience:"11", sessions:"990",  online:"true",  photo:"J"},
  {name:"Dr. Maria Santos",     specialty:"Child Psychology",          country:"Brazil",        language:"Portuguese|English", rating:"4.9", experience:"14", sessions:"1800", online:"true",  photo:"M"},
  {name:"Dr. Priya Sharma",     specialty:"Mindfulness & Stress",      country:"India",         language:"Hindi|English",      rating:"4.7", experience:"7",  sessions:"720",  online:"true",  photo:"P"},
  {name:"Dr. Lars Eriksson",    specialty:"Relationship Therapy",      country:"Sweden",        language:"Swedish|English",    rating:"4.6", experience:"10", sessions:"880",  online:"false", photo:"L"},
  {name:"Dr. Yuki Tanaka",      specialty:"OCD & Phobias",             country:"Japan",         language:"Japanese|English",   rating:"4.9", experience:"13", sessions:"1450", online:"true",  photo:"Y"},
  {name:"Dr. Amira Hassan",     specialty:"Grief & Loss",              country:"Egypt",         language:"Arabic|English",     rating:"4.8", experience:"9",  sessions:"760",  online:"true",  photo:"A"},
  {name:"Dr. Carlos Mendez",    specialty:"Addiction Recovery",        country:"Mexico",        language:"Spanish|English",    rating:"4.7", experience:"11", sessions:"1100", online:"true",  photo:"C"},
  {name:"Dr. Sophie Bernard",   specialty:"Eating Disorders",          country:"France",        language:"French|English",     rating:"4.8", experience:"12", sessions:"1050", online:"true",  photo:"S"},
  {name:"Dr. David Park",       specialty:"ADHD & Autism",             country:"South Korea",   language:"Korean|English",     rating:"4.9", experience:"16", sessions:"2300", online:"true",  photo:"D"},
  {name:"Dr. Nadia Petrov",     specialty:"Bipolar Disorder",          country:"Russia",        language:"Russian|English",    rating:"4.6", experience:"8",  sessions:"690",  online:"true",  photo:"N"},
  {name:"Dr. Oliver Williams",  specialty:"Sleep & Stress",            country:"UK",            language:"English",            rating:"4.8", experience:"10", sessions:"950",  online:"true",  photo:"O"},
  {name:"Dr. Aisha Mohammed",   specialty:"Postpartum Depression",     country:"Saudi Arabia",  language:"Arabic|English",     rating:"4.9", experience:"7",  sessions:"580",  online:"true",  photo:"A"},
  {name:"Dr. Rafael Costa",     specialty:"Phobias & Panic",           country:"Portugal",      language:"Portuguese|English", rating:"4.7", experience:"9",  sessions:"810",  online:"true",  photo:"R"},
  {name:"Dr. Michelle Dubois",  specialty:"Couples Therapy",           country:"Belgium",       language:"French|English",     rating:"4.8", experience:"13", sessions:"1200", online:"true",  photo:"M"},
  {name:"Dr. Kai Zimmermann",   specialty:"Performance Anxiety",       country:"Germany",       language:"German|English",     rating:"4.6", experience:"11", sessions:"980",  online:"false", photo:"K"},
  {name:"Dr. Lena Johansson",   specialty:"Trauma Therapy",            country:"Denmark",       language:"Danish|English",     rating:"4.9", experience:"15", sessions:"1700", online:"true",  photo:"L"}
];

var all = THERAPIST_DATA, filtered = [], cols = 2;

function init() {
  populateFilters();
  applyFilters();
}

function populateFilters() {
  function addOpts(id, items) {
    var el = document.getElementById(id);
    items.filter(Boolean).sort().forEach(function(v) {
      var o = document.createElement("option");
      o.value = v; o.textContent = v;
      el.appendChild(o);
    });
  }
  addOpts("filter-spec",    unique(all.map(function(t){ return t.specialty; })));
  addOpts("filter-country", unique(all.map(function(t){ return t.country; })));
  addOpts("filter-lang",    unique(all.reduce(function(acc, t){
    return acc.concat((t.language||"").split("|").map(function(s){ return s.trim(); }));
  }, [])));
}

function unique(arr) {
  return arr.filter(function(v, i, a){ return v && a.indexOf(v) === i; });
}

function applyFilters() {
  var q  = (document.getElementById("search-input").value || "").toLowerCase().trim();
  var sp = document.getElementById("filter-spec").value;
  var ct = document.getElementById("filter-country").value;
  var ln = document.getElementById("filter-lang").value;

  filtered = all.filter(function(t) {
    var langs = (t.language || "").split("|").map(function(s){ return s.trim(); });
    return (
      (!q  || t.name.toLowerCase().includes(q) || t.specialty.toLowerCase().includes(q)) &&
      (!sp || t.specialty === sp) &&
      (!ct || t.country   === ct) &&
      (!ln || langs.indexOf(ln) !== -1)
    );
  });

  document.getElementById("count-label").textContent =
    filtered.length + " therapist" + (filtered.length !== 1 ? "s" : "") + " found";
  renderGrid();
}

function clearFilters() {
  document.getElementById("search-input").value = "";
  ["filter-spec","filter-country","filter-lang"].forEach(function(id){
    document.getElementById(id).value = "";
  });
  applyFilters();
}

function setColumns(n) {
  cols = n;
  document.querySelectorAll(".view-btn").forEach(function(b, i){
    b.classList.toggle("active", i + 1 === n);
  });
  document.getElementById("therapist-grid").className =
    "therapist-grid" + (n === 1 ? " cols-1" : "");
}

var COLORS = ["#9333ea","#ec4899","#38bdf8","#f87171","#fbbf24","#34d399","#818cf8","#f472b6"];
function cardColor(name) {
  var h = 0;
  for (var i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % COLORS.length;
  return COLORS[h];
}

function starsHtml(r) {
  var n = Math.round(parseFloat(r) || 4);
  return "★".repeat(Math.min(n,5)) + "☆".repeat(Math.max(0, 5 - Math.min(n,5)));
}

function renderGrid() {
  var grid = document.getElementById("therapist-grid");
  if (!filtered.length) {
    grid.innerHTML = '<div class="no-results" style="grid-column:1/-1">No therapists found.</div>';
    return;
  }
  grid.innerHTML = filtered.map(function(t) {
    var color = cardColor(t.name);
    var langs = (t.language||"").split("|").map(function(l){ return l.trim(); }).filter(Boolean)
      .map(function(l){ return '<span class="tc-tag">🌐 ' + l + '</span>'; }).join("");
    var onlineBadge = t.online === "true"
      ? '<span class="tc-tag" style="color:#34d399;border-color:rgba(52,211,153,0.3);background:rgba(52,211,153,0.1)">● Online</span>'
      : "";
    return '<div class="therapist-card">'
      + '<div class="tc-top">'
      +   '<div class="tc-avatar" style="background:linear-gradient(135deg,' + color + ',' + color + '88)">' + (t.photo || t.name[0]) + '</div>'
      +   '<div><div class="tc-name">' + t.name + '</div>'
      +   '<div class="tc-spec">' + t.specialty + '</div>'
      +   '<div class="stars">' + starsHtml(t.rating) + ' <span style="color:rgba(255,255,255,0.4);font-size:0.75rem">' + t.rating + '</span></div></div>'
      + '</div>'
      + '<div class="tc-tags">' + langs + '<span class="tc-tag">📍 ' + t.country + '</span>' + onlineBadge + '</div>'
      + '<div class="tc-info"><span>🏆 ' + t.experience + ' yrs exp</span><span>💬 ' + t.sessions + '+ sessions</span></div>'
      + '<div class="tc-footer">'
      +   '<button class="tc-btn tc-btn-primary" onclick="bookTherapist(\'' + t.name.replace(/'/g,"\\'") + '\')">Book Session</button>'
      +   '<button class="tc-btn tc-btn-secondary">View Profile</button>'
      + '</div></div>';
  }).join("");
}

function bookTherapist(name) {
  alert("Booking request sent for " + name + "!\n\nIn a full build this would open a scheduling system.");
}

init();
