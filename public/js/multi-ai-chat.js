const PERSONAS=[
  {id:"nova",name:"Nova",title:"Logical Analyst",tagline:"Precision. Data. Clarity.",avatar:"N",color:"#38bdf8",glow:"rgba(56,189,248,0.35)",border:"rgba(56,189,248,0.5)",bg:"rgba(56,189,248,0.08)"},
  {id:"luna",name:"Luna",title:"Empath",tagline:"Feelings. Care. Warmth.",avatar:"L",color:"#c084fc",glow:"rgba(192,132,252,0.35)",border:"rgba(192,132,252,0.5)",bg:"rgba(192,132,252,0.08)"},
  {id:"rex",name:"Rex",title:"Straight Talker",tagline:"Blunt. Bold. No B.S.",avatar:"R",color:"#f87171",glow:"rgba(248,113,113,0.35)",border:"rgba(248,113,113,0.5)",bg:"rgba(248,113,113,0.08)"},
  {id:"zara",name:"Zara",title:"Creative Philosopher",tagline:"Art. Ideas. Wonder.",avatar:"Z",color:"#fbbf24",glow:"rgba(251,191,36,0.35)",border:"rgba(251,191,36,0.5)",bg:"rgba(251,191,36,0.08)"}
];
let activeTab="group",chats={group:[],nova:[],luna:[],rex:[],zara:[]},loading={},currentUser=null,saveTimeout=null;
function getP(id){return PERSONAS.find(p=>p.id===id);}

async function init(){
  try{const r=await fetch("/api/auth/me"),d=await r.json();if(!d.loggedIn){window.location.href="/login";return;}currentUser=d.username;}
  catch{window.location.href="/login";return;}
  try{const r=await fetch("/api/chats");if(r.ok){const s=await r.json();if(s&&typeof s==="object")chats={...chats,...s};}}catch{}
  buildHeaderAvatars();buildSidebar();buildMobileTabs();setActiveTab("group");
  const inp=document.getElementById("chat-input");
  inp.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleSend();}});
  inp.addEventListener("input",function(){this.style.height="auto";this.style.height=Math.min(this.scrollHeight,120)+"px";});
}
function buildHeaderAvatars(){document.getElementById("header-avatars").innerHTML=PERSONAS.map(p=>`<div class="mini-avatar" style="background:${p.color}22;border-color:${p.border};color:${p.color}">${p.avatar}</div>`).join("");}
function buildSidebar(){
  document.getElementById("chat-sidebar").innerHTML=
    `<div class="user-info-bar">👤 ${esc(currentUser)}</div><div class="sidebar-label">✨ AI Minds</div>`+
    PERSONAS.map(p=>`<button class="persona-btn" id="sb-${p.id}" onclick="setActiveTab('${p.id}')" style="background:rgba(255,255,255,0.03);border-color:rgba(255,255,255,0.07);">
      <div class="persona-avatar-sm" style="background:radial-gradient(circle at 35% 35%,${p.color}cc,${p.color}55);box-shadow:0 0 12px ${p.glow};">${p.avatar}</div>
      <div><div class="persona-name-sm">${p.name}</div><div class="persona-title-sm">${p.title}</div><div class="persona-tagline-sm" style="color:${p.color}88">${p.tagline}</div></div>
    </button>`).join("")+
    `<div class="sidebar-divider"></div><div class="sidebar-label">👥 Group</div>
    <button class="group-chat-btn" id="sb-group" onclick="setActiveTab('group')" style="background:rgba(255,255,255,0.03);border-color:rgba(255,255,255,0.07);">
      <div class="group-icon-sm">👥</div>
      <div><div class="persona-name-sm" style="color:#d8b4fe;">Group Chat</div><div class="persona-title-sm">All 4 AIs respond</div></div>
    </button>
    <div style="flex:1"></div>
    <button class="clear-chat-btn" onclick="clearChats()">🗑 Clear All Chats</button>
    <button class="sidebar-logout-btn" onclick="doLogout()">⬅ Logout</button>`;
}
function buildMobileTabs(){document.getElementById("mobile-tabs").innerHTML=`<button class="mobile-tab" id="mt-group" onclick="setActiveTab('group')">👥 Group</button>`+PERSONAS.map(p=>`<button class="mobile-tab" id="mt-${p.id}" onclick="setActiveTab('${p.id}')">${p.avatar} ${p.name}</button>`).join("");}
function setActiveTab(tab){activeTab=tab;updateSidebar();updateMobileTabs();updateAreaHeader();updateInputHint();renderMessages();updateSendBtn();}
function updateSidebar(){
  PERSONAS.forEach(p=>{const b=document.getElementById("sb-"+p.id);if(!b)return;const on=p.id===activeTab;
    b.style.background=on?p.bg:"rgba(255,255,255,0.03)";b.style.borderColor=on?p.border:"rgba(255,255,255,0.07)";
    b.style.boxShadow=on?`0 0 18px ${p.glow}`:"none";b.querySelector(".persona-name-sm").style.color=on?p.color:"#e2e8f0";});
  const gb=document.getElementById("sb-group");if(gb){const on=activeTab==="group";
    gb.style.background=on?"rgba(168,85,247,0.15)":"rgba(255,255,255,0.03)";
    gb.style.borderColor=on?"rgba(168,85,247,0.5)":"rgba(255,255,255,0.07)";
    gb.style.boxShadow=on?"0 0 18px rgba(168,85,247,0.3)":"none";}
}
function updateMobileTabs(){
  document.querySelectorAll(".mobile-tab").forEach(b=>{b.style.background="transparent";b.style.borderColor="rgba(255,255,255,0.1)";b.style.color="rgba(255,255,255,0.5)";});
  const mt=document.getElementById("mt-"+activeTab);
  if(mt){if(activeTab==="group"){mt.style.background="rgba(168,85,247,0.2)";mt.style.borderColor="rgba(168,85,247,0.6)";mt.style.color="#d8b4fe";}
  else{const p=getP(activeTab);if(p){mt.style.background=p.bg;mt.style.borderColor=p.border;mt.style.color=p.color;}}}
}
function updateAreaHeader(){
  const el=document.getElementById("chat-area-header");
  if(activeTab==="group"){
    el.innerHTML=`<div class="stacked-avatars">${PERSONAS.map(p=>`<div class="stacked-av" style="background:${p.color}33;color:${p.color};border-color:#0b001a">${p.avatar}</div>`).join("")}</div>
      <div><div class="chat-area-name" style="color:#e9d5ff">Group Chat</div><div class="chat-area-sub">All 4 AIs respond</div></div>
      <div style="margin-left:auto;font-size:0.75rem;color:rgba(255,255,255,0.3)">${chats.group.filter(m=>m.role==="user").length} messages</div>`;
  }else{
    const p=getP(activeTab),mc=chats[activeTab]?.filter(m=>m.role==="user").length||0;
    el.innerHTML=`<div class="msg-av" style="background:radial-gradient(circle at 35% 35%,${p.color}cc,${p.color}55);box-shadow:0 0 12px ${p.glow};border-color:${p.border};width:36px;height:36px;">${p.avatar}</div>
      <div><div class="chat-area-name" style="color:${p.color}">${p.name}</div><div class="chat-area-sub">${p.title} · ${p.tagline}</div></div>
      <div class="private-badge" style="background:${p.bg};color:${p.color};border-color:${p.border};margin-left:auto"><div class="priv-dot" style="background:${p.color};animation:pulse 2s infinite"></div> Private</div>
      <div style="font-size:0.75rem;color:rgba(255,255,255,0.3);margin-left:8px">${mc} msgs</div>`;
  }
}
function updateInputHint(){
  const h=document.getElementById("input-hint"),inp=document.getElementById("chat-input");
  if(activeTab==="group"){h.textContent="All 4 AIs will respond · Enter to send";inp.placeholder="Message all 4 AIs…";}
  else{const p=getP(activeTab);h.textContent=`Private chat with ${p.name} · Enter to send`;inp.placeholder=`Message ${p.name}…`;}
}
function renderMessages(){
  const area=document.getElementById("messages-area"),msgs=chats[activeTab]||[];
  const atBot=area.scrollHeight-area.scrollTop-area.clientHeight<80;
  const typHtml=buildTypingRows();
  if(msgs.length===0&&!Object.keys(loading).length){renderEmpty(area);return;}
  area.innerHTML=msgs.map(buildMsgRow).join("")+typHtml;
  if(atBot||typHtml) requestAnimationFrame(()=>{area.scrollTop=area.scrollHeight;});
}
function renderEmpty(area){
  if(activeTab==="group"){
    area.innerHTML=`<div class="empty-chat">
      <div class="empty-stacked">${PERSONAS.map(p=>`<div class="empty-av" style="background:radial-gradient(circle at 35% 35%,${p.color}cc,${p.color}55);box-shadow:0 0 12px ${p.glow};border-color:#0b001a">${p.avatar}</div>`).join("")}</div>
      <div class="empty-chat-title">Start the Conversation</div>
      <div class="empty-chat-sub">Send a message and all 4 AIs respond simultaneously.</div>
      <div class="suggest-grid">${["What's the meaning of life?","Advice on stress","What is consciousness?","Tell me something surprising"].map(s=>`<button class="suggest-btn" onclick="fillInput('${s.replace(/'/g,"\\'")}')"> ${s}</button>`).join("")}</div>
    </div>`;
  }else{
    const p=getP(activeTab);
    area.innerHTML=`<div class="empty-chat">
      <div class="msg-av" style="width:72px;height:72px;font-size:1.8rem;background:radial-gradient(circle at 35% 35%,${p.color}cc,${p.color}55);box-shadow:0 0 18px ${p.glow};border-color:${p.border};">${p.avatar}</div>
      <div class="empty-chat-title" style="color:${p.color}">${p.name}</div>
      <div style="font-size:0.875rem;color:rgba(255,255,255,0.4)">${p.title}</div>
      <div style="font-size:0.875rem;color:rgba(255,255,255,0.5);font-style:italic">"${p.tagline}"</div>
      <div style="font-size:0.75rem;color:rgba(255,255,255,0.3);padding:6px 12px;border-radius:9999px;background:${p.bg};border:1px solid ${p.border}">🔒 Private</div>
    </div>`;
  }
}
function buildTypingRows(){let h="";if(activeTab==="group")PERSONAS.filter(p=>loading["group_"+p.id]).forEach(p=>{h+=typingRow(p);});else if(loading[activeTab])h+=typingRow(getP(activeTab));return h;}
function buildMsgRow(msg){
  if(msg.role==="user")return`<div class="msg-row user"><div class="msg-body user"><div class="msg-bubble user">${esc(msg.content)}</div></div></div>`;
  const p=msg.personaId?getP(msg.personaId):null;
  const avS=p?`background:radial-gradient(circle at 35% 35%,${p.color}cc,${p.color}55);box-shadow:0 0 12px ${p.glow};border-color:${p.border};`:`background:rgba(255,255,255,0.1);border-color:rgba(255,255,255,0.2);`;
  const bS=p?`background:${p.bg};border-color:${p.border};`:`background:rgba(255,255,255,0.06);border-color:rgba(255,255,255,0.1);`;
  return`<div class="msg-row"><div class="msg-av" style="${avS}">${p?p.avatar:"AI"}</div>
    <div class="msg-body">${p&&activeTab==="group"?`<div class="msg-sender" style="color:${p.color}">${p.name}</div>`:""}
    <div class="msg-bubble ai" style="${bS}">${esc(msg.content)}</div></div></div>`;
}
function typingRow(p){return`<div class="msg-row"><div class="msg-av" style="background:radial-gradient(circle at 35% 35%,${p.color}cc,${p.color}55);box-shadow:0 0 12px ${p.glow};border-color:${p.border};">${p.avatar}</div>
  <div class="msg-body"><div class="msg-bubble ai" style="background:${p.bg};border-color:${p.border};padding:8px 12px;">
    <div class="typing-indicator"><div class="typing-dot" style="background:${p.color}"></div><div class="typing-dot" style="background:${p.color}"></div><div class="typing-dot" style="background:${p.color}"></div></div>
  </div></div></div>`;}
function esc(s){return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function fillInput(t){document.getElementById("chat-input").value=t;document.getElementById("chat-input").focus();}
function scheduleSave(){
  clearTimeout(saveTimeout);const ind=document.getElementById("saving-indicator");if(ind)ind.textContent="Saving…";
  saveTimeout=setTimeout(async()=>{
    try{await fetch("/api/chats",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chats})});
    if(ind){ind.textContent="✓ Saved";setTimeout(()=>{ind.textContent="";},2000);}}
    catch{if(ind)ind.textContent="";}
  },1200);
}
async function clearChats(){if(!confirm("Clear all chat history?"))return;chats={group:[],nova:[],luna:[],rex:[],zara:[]};await fetch("/api/chats",{method:"DELETE"});renderMessages();updateAreaHeader();}
async function doLogout(){await fetch("/api/auth/logout",{method:"POST"});window.location.href="/login";}
function handleSend(){const inp=document.getElementById("chat-input"),text=inp.value.trim();if(!text||Object.keys(loading).length)return;inp.value="";inp.style.height="auto";if(activeTab==="group")sendGroup(text);else sendPrivate(activeTab,text);}
async function sendGroup(text){
  chats.group.push({role:"user",content:text});PERSONAS.forEach(p=>{loading["group_"+p.id]=true;});updateSendBtn();renderMessages();
  const history=chats.group.filter(m=>m.role==="user").slice(-6).map(m=>({role:m.role,content:m.content}));
  const results=await Promise.allSettled(PERSONAS.map(p=>askPersona(p.id,history)));
  results.forEach((res,i)=>{const p=PERSONAS[i];delete loading["group_"+p.id];
    chats.group.push({role:"assistant",content:res.status==="fulfilled"?res.value:"Error: "+(res.reason?.message||"unknown"),personaId:p.id});});
  updateSendBtn();renderMessages();updateAreaHeader();scheduleSave();
}
async function sendPrivate(personaId,text){
  chats[personaId].push({role:"user",content:text});loading[personaId]=true;updateSendBtn();renderMessages();
  try{const history=chats[personaId].slice(-10).map(m=>({role:m.role,content:m.content}));const reply=await askPersona(personaId,history);chats[personaId].push({role:"assistant",content:reply,personaId});}
  catch(e){chats[personaId].push({role:"assistant",content:"Error: "+(e?.message||"unknown"),personaId});}
  finally{delete loading[personaId];updateSendBtn();renderMessages();updateAreaHeader();scheduleSave();}
}
async function askPersona(personaId,messages){const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({persona:personaId,messages})});const d=await r.json();if(!r.ok)throw new Error(d.error||"HTTP "+r.status);return d.text;}
function updateSendBtn(){const btn=document.getElementById("send-btn"),busy=Object.keys(loading).length>0;btn.disabled=busy;const p=activeTab!=="group"?getP(activeTab):null;btn.style.background=p?`linear-gradient(135deg,${p.color},${p.color}88)`:"linear-gradient(135deg,#a855f7,#7c3aed)";btn.style.boxShadow=p?`0 0 18px ${p.glow}`:"0 0 18px rgba(168,85,247,0.5)";}
init();
