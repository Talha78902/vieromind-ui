const QUESTIONS={en:[
  {q:"At a party, you prefer to:",a:["Talk to many different people","Spend time with a few close friends"],dim:"EI",dir:[1,-1]},
  {q:"When solving a problem, you tend to:",a:["Focus on facts and details","Look at the big picture and patterns"],dim:"SN",dir:[1,-1]},
  {q:"When making decisions, you rely more on:",a:["Logic and objective analysis","Personal values and how others feel"],dim:"TF",dir:[1,-1]},
  {q:"You prefer your daily life to be:",a:["Planned and organized","Flexible and spontaneous"],dim:"JP",dir:[1,-1]},
  {q:"After a long day, you recharge by:",a:["Going out with friends","Relaxing alone or with one person"],dim:"EI",dir:[1,-1]},
  {q:"You are more drawn to:",a:["Practical, concrete ideas","Theories and abstract concepts"],dim:"SN",dir:[1,-1]},
  {q:"You believe it's worse to be:",a:["Too emotional","Too cold or detached"],dim:"TF",dir:[-1,1]},
  {q:"You prefer:",a:["Having a clear schedule","Keeping options open"],dim:"JP",dir:[1,-1]},
  {q:"In groups, you:",a:["Enjoy being the center of attention","Prefer to observe and listen"],dim:"EI",dir:[1,-1]},
  {q:"When learning, you prefer:",a:["Step-by-step instructions","General overview then figure it out"],dim:"SN",dir:[1,-1]},
  {q:"When a friend is upset, you:",a:["Help them think through it logically","Focus on their emotional experience"],dim:"TF",dir:[1,-1]},
  {q:"Deadlines are:",a:["Important to meet strictly","Flexible guidelines"],dim:"JP",dir:[1,-1]},
],ur:[
  {q:"کسی پارٹی میں، آپ ترجیح دیتے ہیں:",a:["مختلف لوگوں سے بات کرنا","چند قریبی دوستوں کے ساتھ وقت گزارنا"],dim:"EI",dir:[1,-1]},
  {q:"مسئلہ حل کرتے وقت، آپ:",a:["حقائق اور تفصیلات پر توجہ دیتے ہیں","بڑی تصویر دیکھتے ہیں"],dim:"SN",dir:[1,-1]},
  {q:"فیصلہ کرتے وقت آپ:",a:["منطق پر انحصار کرتے ہیں","ذاتی اقدار اور احساسات پر"],dim:"TF",dir:[1,-1]},
  {q:"آپ روزمرہ زندگی پسند کرتے ہیں:",a:["منظم اور منصوبہ بند","لچکدار اور بے ترتیب"],dim:"JP",dir:[1,-1]},
  {q:"لمبے دن کے بعد آپ آرام کرتے ہیں:",a:["دوستوں کے ساتھ باہر جاکر","اکیلے یا ایک شخص کے ساتھ"],dim:"EI",dir:[1,-1]},
  {q:"آپ زیادہ متوجہ ہوتے ہیں:",a:["عملی اور ٹھوس خیالات سے","نظریات اور تجریدی تصورات سے"],dim:"SN",dir:[1,-1]},
  {q:"آپ کے خیال میں بدتر کیا ہے:",a:["بہت جذباتی ہونا","بہت سرد یا بے پرواہ ہونا"],dim:"TF",dir:[-1,1]},
  {q:"آپ ترجیح دیتے ہیں:",a:["واضح شیڈول رکھنا","آپشنز کھلے رکھنا"],dim:"JP",dir:[1,-1]},
  {q:"گروپ میں آپ:",a:["توجہ کا مرکز بننا پسند کرتے ہیں","مشاہدہ کرنا پسند کرتے ہیں"],dim:"EI",dir:[1,-1]},
  {q:"سیکھتے وقت آپ ترجیح دیتے ہیں:",a:["قدم بہ قدم ہدایات","عمومی جائزہ لے کر خود سمجھنا"],dim:"SN",dir:[1,-1]},
  {q:"جب دوست پریشان ہو تو آپ:",a:["منطقی طور پر مدد کرتے ہیں","جذباتی تجربے پر توجہ دیتے ہیں"],dim:"TF",dir:[1,-1]},
  {q:"ڈیڈلائن:",a:["سختی سے پوری کرنی چاہیے","لچکدار رہنمائی ہے"],dim:"JP",dir:[1,-1]},
]};
const TYPES={INTJ:{name:"The Architect",traits:["Strategic","Independent","Determined","Visionary"],desc:"You see the world as a place full of possibilities. Strategic and reserved, driven by innovation and a deep commitment to your visions."},INTP:{name:"The Logician",traits:["Analytical","Curious","Objective","Precise"],desc:"A quiet soul fascinated by systems and ideas. You delight in theories and love finding logical explanations for everything."},ENTJ:{name:"The Commander",traits:["Bold","Confident","Strategic","Decisive"],desc:"Natural-born leader. You see inefficiency and immediately want to fix it. You thrive on challenge and are driven to achieve."},ENTP:{name:"The Debater",traits:["Innovative","Energetic","Clever","Charismatic"],desc:"You love mental sparring and challenging ideas. Quick-thinking and resourceful, you're never short of new angles."},INFJ:{name:"The Advocate",traits:["Insightful","Principled","Compassionate","Private"],desc:"The rarest type. You have an uncanny ability to understand people and see their potential. Deeply idealistic."},INFP:{name:"The Mediator",traits:["Idealistic","Empathetic","Creative","Loyal"],desc:"Guided by your principles and driven to understand yourself and others. Imaginative, open-minded, and deeply caring."},ENFJ:{name:"The Protagonist",traits:["Charismatic","Warm","Organized","Persuasive"],desc:"A natural leader who senses others' needs. Inspiring and empathetic, you motivate people to be their best selves."},ENFP:{name:"The Campaigner",traits:["Enthusiastic","Creative","Optimistic","Sociable"],desc:"Free-spirited and enthusiastic, you see life as full of possibilities. You connect deeply and love exploring ideas."},ISTJ:{name:"The Logistician",traits:["Reliable","Detailed","Responsible","Traditional"],desc:"Dependable and thorough. You take your commitments seriously and have a strong respect for tradition and processes."},ISFJ:{name:"The Defender",traits:["Warm","Dedicated","Patient","Loyal"],desc:"Quiet and supportive, one of the most dedicated types. You love to serve and remember details about those you care about."},ESTJ:{name:"The Executive",traits:["Organized","Confident","Decisive","Honest"],desc:"You value order, tradition, and getting things done. Excellent at organizing projects and people to meet goals."},ESFJ:{name:"The Consul",traits:["Caring","Sociable","Popular","Loyal"],desc:"Warmhearted and loyal, you care deeply about your social world. You go out of your way to make people happy."},ISTP:{name:"The Virtuoso",traits:["Bold","Practical","Rational","Reserved"],desc:"You love to explore systems with your hands and mind. Quiet and analytical, thriving in practical problem-solving."},ISFP:{name:"The Adventurer",traits:["Charming","Sensitive","Curious","Artistic"],desc:"Quiet and artistic, living in the moment. You have a deep appreciation for beauty and are guided by your feelings."},ESTP:{name:"The Entrepreneur",traits:["Energetic","Pragmatic","Perceptive","Daring"],desc:"You plunge right into action. Living in the moment, observant and energetic, with a talent for connecting with people."},ESFP:{name:"The Entertainer",traits:["Spontaneous","Energetic","Fun","Warm"],desc:"Life is never boring around you. Vivacious and love to entertain — bold, original, and ready for your next adventure."}};
let lang="en",current=0,answers=[],scores={E:0,I:0,S:0,N:0,T:0,F:0,J:0,P:0};
function setLang(l){lang=l;document.getElementById("lang-en").className="lang-btn"+(l==="en"?" active":"");document.getElementById("lang-ur").className="lang-btn"+(l==="ur"?" active":"");document.body.style.direction=l==="ur"?"rtl":"ltr";current=0;answers=[];scores={E:0,I:0,S:0,N:0,T:0,F:0,J:0,P:0};showStart();}
function showStart(){document.getElementById("quiz-container").innerHTML=`<div class="start-wrap"><div class="start-title">${lang==="en"?"MBTI Personality Quiz":"شخصیت کا ٹیسٹ"}</div><div class="start-sub">${lang==="en"?"12 questions · Discover your personality type":"12 سوالات · اپنی شخصیت دریافت کریں"}</div><button class="start-btn" onclick="startQuiz()">${lang==="en"?"Start Quiz →":"ٹیسٹ شروع کریں →"}</button></div>`;}
function startQuiz(){current=0;answers=[];scores={E:0,I:0,S:0,N:0,T:0,F:0,J:0,P:0};showQuestion();}
function showQuestion(){
  const qs=QUESTIONS[lang],q=qs[current],pct=Math.round((current/qs.length)*100);
  document.getElementById("quiz-container").innerHTML=`
    <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${pct}%"></div></div>
    <div class="quiz-qnum">${lang==="en"?"Question":"سوال"} ${current+1} ${lang==="en"?"of":"میں سے"} ${qs.length}</div>
    <div class="quiz-question">${q.q}</div>
    <div class="quiz-options">${q.a.map((a,i)=>`<button class="quiz-option" id="opt${i}" onclick="selectOpt(${i})">${a}</button>`).join("")}</div>
    <div class="quiz-nav">
      ${current>0?`<button class="nav-btn nav-btn-ghost" onclick="goBack()">${lang==="en"?"← Back":"← واپس"}</button>`:""}
      <button class="nav-btn nav-btn-danger" onclick="startQuiz()">${lang==="en"?"Restart":"دوبارہ"}</button>
      <button class="nav-btn nav-btn-ghost" onclick="skipToEnd()">${lang==="en"?"Skip":"آخر"}</button>
      <button class="nav-btn nav-btn-primary" id="btn-next" onclick="goNext()" disabled>${lang==="en"?"Next →":"آگے →"}</button>
    </div>`;
  if(answers[current]!==undefined){document.getElementById("opt"+answers[current]).classList.add("selected");document.getElementById("btn-next").disabled=false;}
}
function selectOpt(i){answers[current]=i;document.querySelectorAll(".quiz-option").forEach((b,j)=>b.classList.toggle("selected",j===i));document.getElementById("btn-next").disabled=false;}
function goNext(){if(answers[current]===undefined)return;const qs=QUESTIONS[lang],q=qs[current],dims=q.dim.split(""),dirs=q.dir,chosen=answers[current];dims.forEach((d,i)=>{scores[d]+=(chosen===i?dirs[i]:dirs[1-i]>0?dirs[1-i]:0);});if(current<qs.length-1){current++;showQuestion();}else showResult();}
function goBack(){if(current>0){current--;showQuestion();}}
function skipToEnd(){answers=QUESTIONS[lang].map(()=>0);current=QUESTIONS[lang].length-1;goNext();}
function showResult(){const type=(scores.E>=scores.I?"E":"I")+(scores.S>=scores.N?"S":"N")+(scores.T>=scores.F?"T":"F")+(scores.J>=scores.P?"J":"P");const info=TYPES[type]||{name:"Unique",traits:["Complex","Interesting"],desc:"You have a fascinating combination of traits!"};document.getElementById("quiz-container").innerHTML=`<div class="result-card"><div class="result-type">${type}</div><div class="result-name">${info.name}</div><div class="result-desc">${info.desc}</div><div class="result-traits">${info.traits.map(t=>`<span class="result-trait">${t}</span>`).join("")}</div><button class="start-btn" onclick="startQuiz()">${lang==="en"?"Take Again":"دوبارہ"}</button></div>`;}
showStart();
