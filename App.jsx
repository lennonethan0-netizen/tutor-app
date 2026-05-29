import { useState, useRef, useEffect } from "react";

const GRADES = [
  { id:"ks3",    label:"KS3",     sub:"Yr 7–9"   },
  { id:"gcse",   label:"GCSE",    sub:"Yr 10–11" },
  { id:"alevel", label:"A-Level", sub:"Yr 12–13" },
];
const SUBJECTS = [
  { id:"maths",            label:"Maths",       abbr:"MTH" },
  { id:"english",          label:"English",     abbr:"ENG" },
  { id:"chemistry",        label:"Chemistry",   abbr:"CHM" },
  { id:"biology",          label:"Biology",     abbr:"BIO" },
  { id:"physics",          label:"Physics",     abbr:"PHY" },
  { id:"history",          label:"History",     abbr:"HIS" },
  { id:"geography",        label:"Geography",   abbr:"GEO" },
  { id:"french",           label:"French",      abbr:"FRN" },
  { id:"spanish",          label:"Spanish",     abbr:"ESP" },
  { id:"computer_science", label:"Comp Sci",    abbr:"CS"  },
  { id:"economics",        label:"Economics",   abbr:"ECO" },
  { id:"psychology",       label:"Psychology",  abbr:"PSY" },
];
const TOPICS = {
  maths:["Algebra","Geometry","Statistics","Calculus","Number","Trigonometry"],
  english:["Comprehension","Grammar","Essay Writing","Poetry","Vocabulary","Literature"],
  chemistry:["Atomic Structure","Bonding","Reactions","Organic","Equations","Periodic Table"],
  biology:["Cell Biology","Genetics","Ecology","Human Body","Evolution","Plants"],
  physics:["Forces","Energy","Waves","Electricity","Space","Quantum"],
  history:["Source Analysis","Causation","Key Events","Key Figures","Change","Significance"],
  geography:["Physical Geo","Human Geo","Climate","Maps","Development","Resources"],
  french:["Vocabulary","Grammar","Translation","Reading","Conjugation","Tenses"],
  spanish:["Vocabulary","Grammar","Translation","Reading","Conjugation","Tenses"],
  computer_science:["Algorithms","Data Structures","Programming","Networks","Databases","Cyber Security"],
  economics:["Microeconomics","Macroeconomics","Markets","Policy","Trade","Diagrams"],
  psychology:["Research Methods","Social","Cognitive","Biological","Studies","Debates"],
};
const SUGGESTIONS = {
  maths:["How do I solve quadratic equations?","Explain Pythagoras theorem","What are the rules for indices?","How does differentiation work?","Walk me through simultaneous equations","Explain mean median and mode"],
  english:["How do I structure a strong essay?","What techniques should I look for in a poem?","How do I analyse a text effectively?","What makes a good conclusion?","Explain simile and metaphor","How do I write a persuasive argument?"],
  chemistry:["Explain ionic and covalent bonding","How do I balance a chemical equation?","Walk me through oxidation and reduction","What is the structure of an atom?","Explain organic chemistry basics","What are the trends in the periodic table?"],
  biology:["How does DNA replication work?","Explain natural selection step by step","What happens during mitosis?","How does the heart pump blood?","Explain photosynthesis clearly","What is the role of enzymes?"],
  physics:["Explain Newtons three laws of motion","What is the difference between current and voltage?","How do waves transfer energy?","Explain conservation of energy","Walk me through how gravity works","What is the difference between speed and velocity?"],
  history:["How do I analyse a historical source?","What makes a strong causation argument?","How do I structure a history essay?","How do I evaluate historical evidence?","Explain how to write about change over time","What is historical significance?"],
  geography:["What causes earthquakes and volcanoes?","Explain the water cycle clearly","How does urbanisation affect cities?","What is climate change and its effects?","How do plate tectonics work?","Explain development differences between countries"],
  french:["How do I conjugate verbs in the past tense?","What are the most important French grammar rules?","How does gender work in French?","Help me understand French verb tenses","What are reflexive verbs?","How do I improve my French writing?"],
  spanish:["How do I conjugate ser vs estar?","Explain the Spanish past tenses","How do reflexive verbs work in Spanish?","What are the most common Spanish verbs?","Help me understand Spanish gender rules","What is the subjunctive in Spanish?"],
  computer_science:["Explain how binary works","What is the difference between a stack and a queue?","How does a sorting algorithm work?","What is object-oriented programming?","How does encryption keep data secure?","Explain what an algorithm is"],
  economics:["Explain supply and demand simply","What is GDP and why does it matter?","How does inflation affect an economy?","Explain market failure","What is the difference between micro and macroeconomics?","How do governments use fiscal policy?"],
  psychology:["Explain the main psychology research methods","What is the nature vs nurture debate?","How does memory work?","Explain social influence and conformity","What are the key psychology studies?","How do I evaluate a psychology theory?"],
};
const FREE_Q = 3;

const G = {
  bg:"#0b0b0f", surf:"#13131a", surf2:"#1a1a24",
  border:"rgba(255,255,255,0.07)", border2:"rgba(255,255,255,0.14)",
  text:"#ededf5", muted:"rgba(237,237,245,0.38)", faint:"rgba(237,237,245,0.055)",
  accent:"#7c6af7", accentL:"rgba(124,106,247,0.15)", accentB:"rgba(124,106,247,0.35)",
  green:"#4ade80", red:"#f87171", amber:"#fbbf24",
  sans:"'Plus Jakarta Sans', system-ui, sans-serif",
};
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  ::-webkit-scrollbar{width:3px}
  ::-webkit-scrollbar-thumb{background:#1a1a24;border-radius:99px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  @keyframes dot{0%,80%,100%{transform:scale(1);opacity:0.4}40%{transform:scale(1.4);opacity:1}}
  @keyframes spin{to{transform:rotate(360deg)}}
  .fade{animation:fadeUp 0.25s ease forwards}
`;

/* Calls YOUR backend (/api/claude), which safely holds the API key */
const callClaude = async (messages, system) => {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, system, max_tokens: 1000 }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data.text || "";
};

function RichText({ text }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {text.split(/\n\n+/).map((block, i) => {
        const t = block.trim();
        if (!t) return null;
        if (/^\d+\.\s/.test(t)) return (
          <ol key={i} style={{ paddingLeft:20, display:"flex", flexDirection:"column", gap:5 }}>
            {t.split(/\n/).filter(Boolean).map((l,j) => (
              <li key={j} style={{ fontSize:14, lineHeight:1.75 }}><Inline text={l.replace(/^\d+\.\s*/,"")} /></li>
            ))}
          </ol>
        );
        if (/^[-•]\s/.test(t)) return (
          <ul key={i} style={{ paddingLeft:18, display:"flex", flexDirection:"column", gap:5 }}>
            {t.split(/\n/).filter(l=>l.trim()).map((l,j) => (
              <li key={j} style={{ fontSize:14, lineHeight:1.75 }}><Inline text={l.replace(/^[-•]\s*/,"")} /></li>
            ))}
          </ul>
        );
        return (
          <p key={i} style={{ fontSize:14, lineHeight:1.75, margin:0 }}>
            {t.split(/\n/).map((l,j) => <span key={j}>{j>0&&<br/>}<Inline text={l}/></span>)}
          </p>
        );
      })}
    </div>
  );
}
function Inline({ text }) {
  return <>{text.split(/\*\*(.*?)\*\*/g).map((p,i) => i%2===1 ? <strong key={i} style={{fontWeight:700}}>{p}</strong> : <span key={i}>{p}</span>)}</>;
}

function PlansScreen({ onBack }) {
  const [yearly, setYearly] = useState(true);
  return (
    <div style={{ minHeight:"100vh", background:G.bg, fontFamily:G.sans, color:G.text, paddingBottom:80 }}>
      <style>{CSS}</style>
      <div style={{ maxWidth:480, margin:"0 auto", padding:"0 20px" }}>
        <div style={{ padding:"22px 0 18px", borderBottom:`1px solid ${G.border}`, marginBottom:36 }}>
          <button onClick={onBack} style={{ background:G.faint, border:`1px solid ${G.border}`, borderRadius:10, padding:"8px 16px", color:G.muted, fontSize:13, fontFamily:G.sans, cursor:"pointer" }}>← Back</button>
        </div>
        <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:G.muted, marginBottom:10 }}>Pricing</p>
        <h1 style={{ fontSize:38, fontWeight:800, letterSpacing:-1.5, lineHeight:1.1, marginBottom:8 }}>Unlock everything</h1>
        <p style={{ color:G.muted, fontSize:14, lineHeight:1.65, marginBottom:32 }}>Unlimited practice across every subject and grade level.</p>
        <div style={{ display:"flex", background:G.surf, borderRadius:10, padding:4, border:`1px solid ${G.border}`, marginBottom:24 }}>
          {["Monthly","Yearly"].map(t => (
            <button key={t} onClick={()=>setYearly(t==="Yearly")} style={{ flex:1, padding:10, borderRadius:8, border:"none", cursor:"pointer", fontFamily:G.sans, fontSize:13, fontWeight:600, background:(t==="Yearly")===yearly?G.surf2:"transparent", color:(t==="Yearly")===yearly?G.text:G.muted, transition:"all 0.15s" }}>
              {t}{t==="Yearly"&&<span style={{ marginLeft:6, fontSize:10, color:G.green }}>−33%</span>}
            </button>
          ))}
        </div>
        <div style={{ background:G.surf, border:`1px solid ${G.accentB}`, borderRadius:16, padding:"26px 22px", marginBottom:12, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, right:0, background:G.accent, padding:"5px 14px", fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", borderBottomLeftRadius:10 }}>Best value</div>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:G.muted, marginBottom:8 }}>Unlimited</p>
          <div style={{ display:"flex", alignItems:"baseline", gap:5, marginBottom:yearly?4:18 }}>
            <span style={{ fontSize:40, fontWeight:800, letterSpacing:-1.5 }}>{yearly?"£2.66":"£3.99"}</span>
            <span style={{ fontSize:14, color:G.muted }}>/mo</span>
          </div>
          {yearly&&<p style={{ fontSize:12, color:G.muted, marginBottom:18 }}>Billed £31.99/year</p>}
          <div style={{ height:1, background:G.border, marginBottom:18 }}/>
          {["Unlimited questions — all subjects","KS3, GCSE & A-Level","AI chat tutor","New topics monthly","Cancel anytime"].map(f=>(
            <div key={f} style={{ display:"flex", gap:10, alignItems:"center", marginBottom:9 }}>
              <span style={{ color:G.accent, fontSize:12, fontWeight:700 }}>✓</span>
              <span style={{ fontSize:13, color:"rgba(237,237,245,0.7)" }}>{f}</span>
            </div>
          ))}
          <button style={{ width:"100%", marginTop:18, padding:15, borderRadius:10, border:"none", background:G.accent, color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:G.sans }}>Subscribe with PayPal</button>
        </div>
        <div style={{ background:G.surf, border:`1px solid ${G.border}`, borderRadius:16, padding:"22px", marginBottom:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
            <div>
              <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:G.muted, marginBottom:6 }}>One-time top-up</p>
              <div style={{ display:"flex", alignItems:"baseline", gap:4 }}>
                <span style={{ fontSize:32, fontWeight:800, letterSpacing:-1 }}>£1.99</span>
                <span style={{ fontSize:13, color:G.muted }}>once</span>
              </div>
            </div>
            <div style={{ background:G.faint, borderRadius:10, padding:"10px 14px", textAlign:"center" }}>
              <div style={{ fontSize:24, fontWeight:800 }}>+50</div>
              <div style={{ fontSize:10, color:G.muted, letterSpacing:"0.1em", textTransform:"uppercase" }}>questions</div>
            </div>
          </div>
          {["50 questions, never expire","All subjects & grades","No subscription"].map(f=>(
            <div key={f} style={{ display:"flex", gap:8, alignItems:"center", marginBottom:7 }}>
              <span style={{ fontSize:12, color:G.muted }}>—</span>
              <span style={{ fontSize:13, color:G.muted }}>{f}</span>
            </div>
          ))}
          <button style={{ width:"100%", marginTop:14, padding:13, borderRadius:10, border:`1px solid ${G.border2}`, background:"transparent", color:"rgba(237,237,245,0.65)", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:G.sans }}>Buy with PayPal</button>
        </div>
        <p style={{ textAlign:"center", fontSize:11, color:"rgba(237,237,245,0.18)", lineHeight:1.8 }}>Secure payments via PayPal · Cancel anytime</p>
      </div>
    </div>
  );
}

export default function App() {
  const [screen,   setScreen]   = useState("home");
  const [grade,    setGrade]    = useState(GRADES[1]);
  const [subject,  setSubject]  = useState(SUBJECTS[0]);
  const [topic,    setTopic]    = useState(TOPICS.maths[0]);
  const [question, setQuestion] = useState(null);
  const [answer,   setAnswer]   = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [hintOn,   setHintOn]   = useState(false);
  const [score,    setScore]    = useState({ c:0, t:0 });
  const [qUsed,    setQUsed]    = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [gate,     setGate]     = useState(false);
  const [streak,   setStreak]   = useState(0);
  const [msgs,     setMsgs]     = useState([]);
  const [input,    setInput]    = useState("");
  const [thinking, setThinking] = useState(false);
  const [visibleSuggs, setVisibleSuggs] = useState([]);
  const chatEnd = useRef(null);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs]);

  useEffect(() => {
    const all = [...(SUGGESTIONS[subject.id]||[])].sort(()=>Math.random()-0.5);
    setVisibleSuggs(all.slice(0,3));
  }, [subject.id]);

  const pickSubject = s => { setSubject(s); setTopic(TOPICS[s.id][0]); };
  const pct = score.t > 0 ? Math.round((score.c/score.t)*100) : null;

  const rotateSugg = (used) => {
    const all = SUGGESTIONS[subject.id]||[];
    const next = visibleSuggs.filter(s=>s!==used);
    const pool = all.filter(s=>!next.includes(s)&&s!==used);
    if (pool.length > 0) {
      const pick = pool[Math.floor(Math.random()*pool.length)];
      setVisibleSuggs([...next, pick]);
    } else {
      setVisibleSuggs(next);
    }
  };

  const genQuestion = async () => {
    if (qUsed >= FREE_Q && !unlocked) { setGate(true); return; }
    setLoading(true); setFeedback(null); setAnswer(""); setHintOn(false);
    const gradeLabel = {ks3:"KS3 (Year 7-9)",gcse:"GCSE (Year 10-11)",alevel:"A-Level (Year 12-13)"}[grade.id];
    try {
      const text = await callClaude(
        [{ role:"user", content:`Generate a ${gradeLabel} ${subject.label} exam question on: ${topic}. Return ONLY a JSON object with these fields: question (string), hint (string), answer (string), working (string), marks (number). No markdown, no extra text, just the JSON object.` }],
        `You are a UK ${subject.label} examiner. Return only a valid JSON object, nothing else.`
      );
      const clean = text.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      setQuestion(parsed);
      setQUsed(q=>q+1);
      setScreen("quiz");
    } catch(e) {
      alert("Error generating question: " + e.message);
    }
    setLoading(false);
  };

  const checkAnswer = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    try {
      const text = await callClaude(
        [{ role:"user", content:`Subject: ${subject.label} (${grade.label})\nQuestion: ${question.question}\nCorrect answer: ${question.answer}\nStudent answer: ${answer}\n\nReturn ONLY a JSON object: correct (boolean), partial (boolean), marks_awarded (number), message (string), explanation (string). No markdown, just JSON.` }],
        `You are a fair ${subject.label} teacher. Return only a valid JSON object, nothing else.`
      );
      const clean = text.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      setFeedback(parsed);
      setScore(s=>({c:s.c+(parsed.correct?1:0),t:s.t+1}));
      setStreak(s=>parsed.correct?s+1:0);
    } catch(e) {
      setFeedback({ correct:false, partial:false, marks_awarded:0, message:"Could not mark automatically.", explanation:"Model answer: "+question.answer });
    }
    setLoading(false);
  };

  const sendMsg = async (txt) => {
    const content = txt||input.trim();
    if (!content||thinking) return;
    if (!txt) setInput("");
    if (txt) rotateSugg(txt);
    const userMsg = { role:"user", content };
    const nextMsgs = [...msgs, userMsg];
    setMsgs(nextMsgs);
    setThinking(true);
    try {
      const reply = await callClaude(
        nextMsgs,
        `You are an expert ${subject.label} tutor for ${grade.label} students in the UK. Explain things clearly in proper paragraphs like a great teacher. Use **bold** for key terms. Use numbered steps for processes. Be warm and encouraging. Do not use excessive punctuation.`
      );
      setMsgs([...nextMsgs, { role:"assistant", content:reply }]);
    } catch(e) {
      setMsgs([...nextMsgs, { role:"assistant", content:"Error: "+e.message }]);
    }
    setThinking(false);
  };

  if (screen==="subscription") return <><style>{CSS}</style><PlansScreen onBack={()=>setScreen("home")}/></>;

  if (screen==="chat") return (
    <div style={{ height:"100vh", background:G.bg, fontFamily:G.sans, color:G.text, display:"flex", flexDirection:"column" }}>
      <style>{CSS}</style>
      <div style={{ padding:"14px 18px", borderBottom:`1px solid ${G.border}`, display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
        <button onClick={()=>setScreen(question?"quiz":"home")} style={{ background:G.faint, border:`1px solid ${G.border}`, borderRadius:10, padding:"8px 14px", color:G.muted, fontSize:13, fontFamily:G.sans, cursor:"pointer" }}>←</button>
        <div style={{ width:34, height:34, borderRadius:10, background:G.accentL, border:`1px solid ${G.accentB}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>✦</div>
        <div>
          <div style={{ fontSize:14, fontWeight:700 }}>{subject.label} Tutor</div>
          <div style={{ fontSize:11, color:G.muted }}>{grade.label}</div>
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"20px 18px" }}>
        {msgs.length===0&&(
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", paddingTop:32, gap:24 }}>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:32, marginBottom:10, opacity:0.3 }}>✦</div>
              <p style={{ fontSize:16, fontWeight:700, marginBottom:6 }}>Ask me anything</p>
              <p style={{ fontSize:13, color:G.muted, lineHeight:1.6 }}>I'll explain it clearly, step by step.</p>
            </div>
            <div style={{ width:"100%", maxWidth:440, display:"flex", flexDirection:"column", gap:8 }}>
              {visibleSuggs.map((s,i)=>(
                <button key={i} onClick={()=>sendMsg(s)} style={{ background:G.surf, border:`1px solid ${G.border}`, borderRadius:12, padding:"13px 16px", color:G.text, fontSize:13, fontFamily:G.sans, textAlign:"left", cursor:"pointer", display:"flex", justifyContent:"space-between", gap:10 }}>
                  <span>{s}</span><span style={{ color:G.muted, flexShrink:0 }}>→</span>
                </button>
              ))}
            </div>
          </div>
        )}
        <div style={{ display:"flex", flexDirection:"column", gap:18, maxWidth:640, margin:"0 auto" }}>
          {msgs.map((m,i)=>(
            <div key={i} className="fade" style={{ display:"flex", flexDirection:"column", alignItems:m.role==="user"?"flex-end":"flex-start" }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:G.muted, marginBottom:5 }}>
                {m.role==="user"?"You":subject.label+" Tutor"}
              </div>
              <div style={{ maxWidth:"86%", padding:m.role==="user"?"11px 15px":"15px 18px", borderRadius:m.role==="user"?"14px 14px 3px 14px":"3px 14px 14px 14px", background:m.role==="user"?G.accent:G.surf, border:m.role==="user"?"none":`1px solid ${G.border}`, color:m.role==="user"?"#fff":G.text }}>
                {m.role==="user"
                  ? <p style={{ fontSize:14, lineHeight:1.6, margin:0 }}>{m.content}</p>
                  : <RichText text={m.content}/>
                }
              </div>
            </div>
          ))}
          {msgs.length>0&&!thinking&&msgs[msgs.length-1]?.role==="assistant"&&(
            <div style={{ display:"flex", flexWrap:"wrap", gap:7, paddingLeft:2 }}>
              {visibleSuggs.slice(0,2).map((s,i)=>(
                <button key={i} onClick={()=>sendMsg(s)} style={{ background:G.faint, border:`1px solid ${G.border}`, borderRadius:99, padding:"6px 13px", color:G.muted, fontSize:12, fontFamily:G.sans, cursor:"pointer" }}>{s}</button>
              ))}
            </div>
          )}
          {thinking&&(
            <div style={{ display:"flex", gap:5, padding:"4px 0" }}>
              {[0,1,2].map(i=><div key={i} style={{ width:7, height:7, borderRadius:"50%", background:G.accent, animation:"dot 1.4s infinite", animationDelay:`${i*0.2}s` }}/>)}
            </div>
          )}
          <div ref={chatEnd}/>
        </div>
      </div>

      <div style={{ padding:"12px 16px", borderTop:`1px solid ${G.border}`, display:"flex", gap:8, flexShrink:0 }}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()}
          placeholder={`Ask about ${subject.label}…`}
          style={{ flex:1, background:G.surf, border:`1px solid ${G.border}`, borderRadius:12, padding:"12px 15px", color:G.text, fontSize:14, fontFamily:G.sans, outline:"none" }}/>
        <button onClick={()=>sendMsg()} disabled={thinking||!input.trim()} style={{ padding:"12px 16px", borderRadius:12, border:"none", fontSize:18, background:input.trim()?G.accent:G.faint, color:input.trim()?"#fff":G.muted, cursor:input.trim()?"pointer":"not-allowed" }}>↑</button>
      </div>
    </div>
  );

  if (screen==="quiz") return (
    <div style={{ minHeight:"100vh", background:G.bg, fontFamily:G.sans, color:G.text, paddingBottom:60 }}>
      <style>{CSS}</style>
      <div style={{ padding:"14px 18px", borderBottom:`1px solid ${G.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <button onClick={()=>setScreen("home")} style={{ background:G.faint, border:`1px solid ${G.border}`, borderRadius:10, padding:"8px 14px", color:G.muted, fontSize:13, fontFamily:G.sans, cursor:"pointer" }}>← Home</button>
        <div style={{ display:"flex", gap:6 }}>
          {[subject.label,grade.label,topic].map(t=><span key={t} style={{ fontSize:11, fontWeight:600, background:G.faint, color:G.muted, padding:"4px 10px", borderRadius:6 }}>{t}</span>)}
        </div>
        <button onClick={()=>{setMsgs([]);setScreen("chat");}} style={{ background:G.faint, border:`1px solid ${G.border}`, borderRadius:10, padding:"8px 14px", color:G.muted, fontSize:13, fontFamily:G.sans, cursor:"pointer" }}>Ask tutor</button>
      </div>
      <div style={{ maxWidth:620, margin:"0 auto", padding:"32px 18px 0" }}>
        {question?.marks&&(
          <div style={{ display:"inline-flex", background:G.accentL, border:`1px solid ${G.accentB}`, borderRadius:99, padding:"4px 12px", marginBottom:18 }}>
            <span style={{ fontSize:12, color:"#a89bfa", fontWeight:600 }}>{question.marks} mark{question.marks>1?"s":""}</span>
          </div>
        )}
        <div className="fade" style={{ background:G.surf, border:`1px solid ${G.border}`, borderRadius:16, padding:"24px 22px", marginBottom:14 }}>
          <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:G.muted, marginBottom:14 }}>Question</p>
          <p style={{ fontSize:18, lineHeight:1.7, whiteSpace:"pre-wrap" }}>{question?.question}</p>
        </div>
        {!feedback&&(!hintOn
          ?<button onClick={()=>setHintOn(true)} style={{ display:"flex", alignItems:"center", gap:7, background:"transparent", border:`1px solid ${G.border}`, borderRadius:8, padding:"8px 13px", color:G.muted, fontSize:12, fontFamily:G.sans, cursor:"pointer", marginBottom:14 }}>💡 Reveal hint</button>
          :<div className="fade" style={{ background:G.accentL, border:`1px solid ${G.accentB}`, borderRadius:10, padding:"11px 15px", fontSize:13, color:"#c4b5fd", lineHeight:1.6, marginBottom:14 }}>💡 {question?.hint}</div>
        )}
        {!feedback&&(
          <div className="fade">
            <textarea value={answer} onChange={e=>setAnswer(e.target.value)}
              placeholder={question?.marks>2?`Detailed answer — worth ${question.marks} marks…`:"Your answer…"}
              rows={question?.marks>2?5:3}
              style={{ width:"100%", background:G.surf, border:`1px solid ${G.border}`, borderRadius:12, padding:"13px 15px", color:G.text, fontSize:15, fontFamily:G.sans, resize:"vertical", outline:"none", lineHeight:1.7, marginBottom:10 }}/>
            <button onClick={checkAnswer} disabled={loading||!answer.trim()} style={{ width:"100%", padding:15, borderRadius:12, border:"none", background:answer.trim()?G.accent:G.faint, color:answer.trim()?"#fff":G.muted, fontSize:15, fontWeight:700, fontFamily:G.sans, cursor:answer.trim()?"pointer":"not-allowed" }}>
              {loading?"Checking…":"Check Answer"}
            </button>
          </div>
        )}
        {feedback&&(
          <div className="fade">
            <div style={{ background:feedback.correct?"rgba(74,222,128,0.07)":feedback.partial?"rgba(251,191,36,0.07)":"rgba(248,113,113,0.07)", border:`1px solid ${feedback.correct?"rgba(74,222,128,0.25)":feedback.partial?"rgba(251,191,36,0.25)":"rgba(248,113,113,0.25)"}`, borderRadius:16, padding:"20px", marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <span style={{ fontSize:14, fontWeight:700, color:feedback.correct?G.green:feedback.partial?G.amber:G.red }}>
                  {feedback.correct?"✓  Correct":feedback.partial?"◑  Partial credit":"✗  Incorrect"}
                </span>
                {question?.marks&&<span style={{ fontSize:12, color:G.muted, background:G.faint, padding:"3px 10px", borderRadius:99 }}>{feedback.marks_awarded??0}/{question.marks} marks</span>}
              </div>
              <p style={{ fontSize:14, color:G.muted, lineHeight:1.7, marginBottom:14 }}>{feedback.message}</p>
              <div style={{ borderTop:`1px solid ${G.border}`, paddingTop:14 }}>
                <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:G.muted, marginBottom:8 }}>Model Answer</p>
                <p style={{ fontSize:13, color:"rgba(237,237,245,0.5)", lineHeight:1.85, whiteSpace:"pre-wrap" }}>{feedback.explanation}</p>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:10 }}>
              <button onClick={genQuestion} disabled={loading} style={{ padding:15, borderRadius:12, border:"none", background:G.accent, color:"#fff", fontSize:15, fontWeight:700, fontFamily:G.sans, cursor:"pointer" }}>{loading?"Loading…":"Next Question →"}</button>
              <button onClick={()=>{setMsgs([]);setScreen("chat");}} style={{ padding:"15px 16px", borderRadius:12, border:`1px solid ${G.border}`, background:"transparent", color:G.muted, fontSize:13, fontFamily:G.sans, cursor:"pointer" }}>Ask</button>
            </div>
          </div>
        )}
      </div>
      {gate&&(
        <div style={{ position:"fixed", inset:0, background:"rgba(8,8,14,0.9)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:99, backdropFilter:"blur(12px)" }}>
          <div style={{ background:G.surf, border:`1px solid ${G.border}`, borderRadius:20, padding:"36px 28px", maxWidth:340, width:"90%", textAlign:"center" }}>
            <div style={{ width:46, height:46, borderRadius:13, background:G.accentL, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px", fontSize:20 }}>🔒</div>
            <h2 style={{ fontSize:19, fontWeight:700, marginBottom:8 }}>Free questions used up</h2>
            <p style={{ color:G.muted, fontSize:13, lineHeight:1.65, marginBottom:24 }}>Unlock unlimited access or grab a top-up.</p>
            <button onClick={()=>{setGate(false);setScreen("subscription");}} style={{ width:"100%", padding:13, borderRadius:10, border:"none", background:G.accent, color:"#fff", fontSize:14, fontWeight:700, fontFamily:G.sans, cursor:"pointer", marginBottom:8 }}>View Plans →</button>
            <button onClick={()=>{setUnlocked(true);setGate(false);genQuestion();}} style={{ width:"100%", padding:11, borderRadius:10, border:`1px solid ${G.border}`, background:"transparent", color:G.muted, fontSize:13, fontFamily:G.sans, cursor:"pointer" }}>Demo unlock</button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:G.bg, fontFamily:G.sans, color:G.text, paddingBottom:60 }}>
      <style>{CSS}</style>
      <div style={{ padding:"16px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${G.border}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
          <div style={{ width:28, height:28, borderRadius:8, background:G.accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>✦</div>
          <span style={{ fontSize:15, fontWeight:800, letterSpacing:-0.3 }}>Revision AI</span>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {pct!==null&&<span style={{ fontSize:12, fontWeight:700, padding:"4px 10px", borderRadius:99, background:pct>=70?"rgba(74,222,128,0.12)":"rgba(248,113,113,0.12)", color:pct>=70?G.green:G.red }}>{pct}%</span>}
          {streak>1&&<span style={{ fontSize:12, color:G.amber }}>🔥 {streak}</span>}
          <button onClick={()=>{setMsgs([]);setScreen("chat");}} style={{ background:G.surf, border:`1px solid ${G.border}`, borderRadius:8, padding:"8px 14px", color:G.muted, fontSize:12, fontWeight:600, fontFamily:G.sans, cursor:"pointer" }}>Chat</button>
          <button onClick={()=>setScreen("subscription")} style={{ background:G.accent, border:"none", borderRadius:8, padding:"8px 14px", color:"#fff", fontSize:12, fontWeight:700, fontFamily:G.sans, cursor:"pointer" }}>Plans</button>
        </div>
      </div>
      <div style={{ maxWidth:860, margin:"0 auto", padding:"36px 20px 0" }}>
        <div style={{ marginBottom:40 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:G.accentL, border:`1px solid ${G.accentB}`, borderRadius:99, padding:"5px 13px", marginBottom:18 }}>
            <span style={{ width:5, height:5, borderRadius:"50%", background:G.accent, display:"inline-block" }}/>
            <span style={{ fontSize:11, fontWeight:700, color:"#a89bfa", letterSpacing:"0.08em" }}>AI-powered exam practice</span>
          </div>
          <h1 style={{ fontSize:"clamp(28px,5vw,50px)", fontWeight:800, letterSpacing:-1.5, lineHeight:1.1, marginBottom:10 }}>Practice smarter.<br/><span style={{ color:G.accent }}>Score higher.</span></h1>
          <p style={{ color:G.muted, fontSize:14, lineHeight:1.6, maxWidth:440 }}>AI-generated questions, instant marking, and a personal tutor — across 12 subjects.</p>
        </div>
        <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:G.muted, marginBottom:10 }}>Year group</p>
        <div style={{ display:"flex", gap:8, marginBottom:28 }}>
          {GRADES.map(g=>(
            <button key={g.id} onClick={()=>setGrade(g)} style={{ padding:"11px 18px", borderRadius:10, cursor:"pointer", border:`1px solid ${grade.id===g.id?G.accentB:G.border}`, background:grade.id===g.id?G.accentL:G.surf, transition:"all 0.15s", minWidth:90 }}>
              <div style={{ fontSize:14, fontWeight:700, color:grade.id===g.id?"#a89bfa":G.text }}>{g.label}</div>
              <div style={{ fontSize:11, color:G.muted, marginTop:1 }}>{g.sub}</div>
            </button>
          ))}
        </div>
        <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:G.muted, marginBottom:10 }}>Subject</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:28 }}>
          {SUBJECTS.map(s=>(
            <button key={s.id} onClick={()=>pickSubject(s)} style={{ padding:"13px 10px", borderRadius:12, cursor:"pointer", textAlign:"left", border:`1px solid ${subject.id===s.id?G.accentB:G.border}`, background:subject.id===s.id?G.accentL:G.surf, transition:"all 0.15s" }}>
              <div style={{ fontSize:10, fontWeight:700, color:subject.id===s.id?"#a89bfa":G.muted, letterSpacing:"0.08em", marginBottom:3 }}>{s.abbr}</div>
              <div style={{ fontSize:13, fontWeight:600, color:subject.id===s.id?G.text:"rgba(237,237,245,0.6)" }}>{s.label}</div>
            </button>
          ))}
        </div>
        <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:G.muted, marginBottom:10 }}>Topic</p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:32 }}>
          {(TOPICS[subject.id]||[]).map(t=>(
            <button key={t} onClick={()=>setTopic(t)} style={{ padding:"7px 14px", borderRadius:99, border:`1px solid ${topic===t?G.accentB:G.border}`, background:topic===t?G.accentL:"transparent", color:topic===t?"#a89bfa":G.muted, fontSize:12, fontWeight:topic===t?600:400, fontFamily:G.sans, cursor:"pointer", transition:"all 0.15s" }}>{t}</button>
          ))}
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={genQuestion} disabled={loading} style={{ flex:1, padding:16, borderRadius:12, border:"none", background:loading?G.surf:G.accent, color:loading?G.muted:"#fff", fontSize:15, fontWeight:700, fontFamily:G.sans, cursor:loading?"not-allowed":"pointer" }}>
            {loading?"Generating…":`Start ${subject.label} — ${topic} →`}
          </button>
          <button onClick={()=>{setMsgs([]);setScreen("chat");}} style={{ padding:"16px 18px", borderRadius:12, border:`1px solid ${G.border}`, background:G.surf, color:G.muted, fontSize:14, fontFamily:G.sans, cursor:"pointer", whiteSpace:"nowrap" }}>Chat with tutor</button>
        </div>
        {!unlocked&&(
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:10 }}>
            <span style={{ fontSize:11, color:"rgba(237,237,245,0.18)" }}>{Math.max(0,FREE_Q-qUsed)} free question{FREE_Q-qUsed!==1?"s":""} left</span>
            <button onClick={()=>setScreen("subscription")} style={{ background:"none", border:"none", color:G.accent, fontSize:11, cursor:"pointer", fontFamily:G.sans, opacity:0.8 }}>Unlock unlimited →</button>
          </div>
        )}
      </div>
    </div>
  );
}
