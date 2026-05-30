import { useState, useEffect, useRef } from 'react'

// ── Icons ────────────────────────────────────────────────────────────
const SparkleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 1l1.5 4.5L14 7l-4.5 1.5L8 13l-1.5-4.5L2 7l4.5-1.5L8 1z"/>
  </svg>
)
const ArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 2v8M5 7l3 3 3-3M2 12h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const CopyIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M5 5V3a1 1 0 011-1h6a1 1 0 011 1v7a1 1 0 01-1 1h-2M1 5a1 1 0 011-1h6a1 1 0 011 1v7a1 1 0 01-1 1H2a1 1 0 01-1-1V5z" stroke="currentColor" strokeWidth="1.4"/>
  </svg>
)
const KeyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="6" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M9 8.5l5 5M12.5 11l1.5 1.5M14 9.5L15.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)
const CheckDone = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8l3.5 3.5L13 4.5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// ── ATS Score Ring ────────────────────────────────────────────────────
function ATSRing({ score, animate }) {
  const [display, setDisplay] = useState(animate ? 0 : score)
  const r = 58
  const circ = 2 * Math.PI * r
  const offset = circ - (display / 100) * circ
  const color = display >= 70 ? '#10b981' : display >= 40 ? '#f59e0b' : '#ef4444'
  const label = display >= 70 ? 'Strong match' : display >= 40 ? 'Needs work' : 'Poor match'

  useEffect(() => {
    if (!animate) { setDisplay(score); return }
    let start = null
    const duration = 1400
    const from = 0
    const to = score
    const step = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(from + (to - from) * ease))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [score, animate])

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
      <div style={{ position:'relative', display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
        <svg width="148" height="148" style={{ transform:'rotate(-90deg)' }}>
          <circle cx="74" cy="74" r={r} fill="none" strokeWidth="10" stroke="var(--surface-2)" />
          <circle cx="74" cy="74" r={r} fill="none" strokeWidth="10"
            stroke={color}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition:'stroke-dashoffset 0.05s linear' }}
          />
        </svg>
        <div style={{ position:'absolute', textAlign:'center' }}>
          <div style={{ fontSize:32, fontWeight:900, color, letterSpacing:'-0.02em' }}>{display}%</div>
          <div style={{ fontSize:11, color:'var(--text-muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em' }}>ATS Score</div>
        </div>
      </div>
      <div style={{ fontSize:14, fontWeight:600, color }}>{label}</div>
    </div>
  )
}

// ── ATS Calculator (no API needed) ───────────────────────────────────
const STOP = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','by','from','is','are','was','were','be','been','have','has','had','do','does','did','will','would','could','should','may','might','this','that','these','those','their','they','our','your','all','as','if','so','we','you','he','she','it','its','not','no','can','also','into','about','than','then','when','how','what','who','which','more','some','such','each','both','very','just','well','even','after','before','over','under','between','through','during','within','without','against','along','following','across','behind','beyond','plus','except','up','out','around','down','off','above','below','use','using','used','make','making','made','take','taking','taken','need','needs','required','must','shall','working','work','works','team','teams','role','based','including','include','includes','able','ensure','ensuring','manage','managing','across','own','new','good','high','level','strong','key','experience','experiences','experienced'])

function calcATS(job, cv) {
  const tok = (t) => [...new Set(t.toLowerCase().replace(/[^\w\s]/g,' ').split(/\s+/).filter(w => w.length > 2 && !STOP.has(w)))]
  const jobToks = tok(job)
  const cvLower = cv.toLowerCase()
  const matched = jobToks.filter(t => cvLower.includes(t))
  const missing = jobToks.filter(t => !cvLower.includes(t))
  const score = jobToks.length > 0 ? Math.min(100, Math.round((matched.length / jobToks.length) * 100)) : 0
  return { score, matched: matched.slice(0,18), missing: missing.slice(0,18), total: jobToks.length }
}

// ── Claude API ────────────────────────────────────────────────────────
async function callClaude(apiKey, systemPrompt, userMessage) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-allow-browser': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 3000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `API error ${res.status}`)
  }
  const data = await res.json()
  return data.content[0].text
}

const CV_SYSTEM = `You are an expert CV writer and ATS optimisation specialist with 15 years of experience. Your job is to rewrite CVs to maximise ATS pass rates while maintaining authenticity and professionalism.

Rules:
- NEVER invent skills, experience, or qualifications the candidate doesn't have
- Rewrite their EXISTING experience using keywords from the job description
- Use strong action verbs: led, delivered, built, designed, optimised, increased, reduced
- Include measurable achievements where the candidate mentions them
- Structure: Contact Info placeholder → Professional Summary (3-4 sentences) → Key Skills (8-12 bullet points) → Work Experience → Education
- Bold section headings using markdown (## for sections)
- Keep it to 1-2 pages equivalent
- Use the exact keywords and phrases from the job description naturally throughout
- Return ONLY the CV content, no commentary`

const COVER_SYSTEM = `You are an expert cover letter writer. Write compelling, personalised cover letters that complement an optimised CV.

Rules:
- 3-4 short paragraphs
- Opening: show genuine interest and mention the role/company specifically
- Middle: highlight 2-3 specific achievements from the CV that match the role
- Closing: confident call to action
- Tone: professional but human, not robotic
- DO NOT use clichés like "I am writing to apply for..." or "I believe I would be a great fit"
- Return ONLY the cover letter, no commentary or subject line`

// ── Export PDF ────────────────────────────────────────────────────────
function exportPDF(content, type = 'CV') {
  const w = window.open('', '_blank')
  const md = content
    .replace(/## (.+)/g, '<h2 style="font-size:15pt;font-weight:700;border-bottom:1px solid #000;padding-bottom:4px;margin:16px 0 8px">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li style="margin:4px 0">$1</li>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>')
  w.document.write(`<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>${type}</title>
<style>
  body { font-family: 'Calibri', Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #000; padding: 40px; max-width: 700px; margin: 0 auto; }
  h2 { font-size: 13pt; font-weight: 700; border-bottom: 1px solid #333; padding-bottom: 3px; margin: 16px 0 8px; }
  li { margin: 3px 0; }
  ul { padding-left: 20px; }
  @media print { body { padding: 20px; } }
</style></head>
<body>${md}</body></html>`)
  w.document.close()
  setTimeout(() => { w.focus(); w.print() }, 400)
}

// ── Main Tool ─────────────────────────────────────────────────────────
export default function Tool({ onBack }) {
  const [step, setStep] = useState('input')       // input | scored | optimising | result
  const [jobDesc, setJobDesc] = useState('')
  const [cvText, setCvText] = useState('')
  const [ats, setAts] = useState(null)
  const [optimizedCV, setOptimizedCV] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
  const [showCover, setShowCover] = useState(false)
  const [loading, setLoading] = useState('')       // '' | 'cv' | 'cover'
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('applyedge_key') || '')
  const [showKeyPanel, setShowKeyPanel] = useState(false)
  const [keyInput, setKeyInput] = useState('')
  const resultRef = useRef(null)

  function saveKey() {
    const k = keyInput.trim()
    if (!k.startsWith('sk-ant-')) { setError('API key should start with sk-ant-'); return }
    localStorage.setItem('applyedge_key', k)
    setApiKey(k)
    setShowKeyPanel(false)
    setKeyInput('')
    setError('')
  }

  function removeKey() {
    localStorage.removeItem('applyedge_key')
    setApiKey('')
    setShowKeyPanel(false)
  }

  function handleAnalyse() {
    if (!jobDesc.trim() || !cvText.trim()) { setError('Please fill in both the job description and your CV.'); return }
    setError('')
    const result = calcATS(jobDesc, cvText)
    setAts(result)
    setStep('scored')
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior:'smooth', block:'start' }), 100)
  }

  async function handleOptimise() {
    if (!apiKey) { setShowKeyPanel(true); return }
    setLoading('cv')
    setError('')
    setStep('optimising')
    try {
      const prompt = `JOB DESCRIPTION:\n${jobDesc}\n\nCANDIDATE'S CURRENT CV/EXPERIENCE:\n${cvText}\n\nPlease rewrite this CV optimised for the job description above.`
      const result = await callClaude(apiKey, CV_SYSTEM, prompt)
      setOptimizedCV(result)
      const newAts = calcATS(jobDesc, result)
      setAts(newAts)
      setStep('result')
    } catch (e) {
      setError(e.message)
      setStep('scored')
    } finally {
      setLoading('')
    }
  }

  async function handleCoverLetter() {
    if (!apiKey) { setShowKeyPanel(true); return }
    if (coverLetter) { setShowCover(true); return }
    setLoading('cover')
    setError('')
    try {
      const prompt = `JOB DESCRIPTION:\n${jobDesc}\n\nOPTIMISED CV:\n${optimizedCV || cvText}\n\nWrite a tailored cover letter for this application.`
      const result = await callClaude(apiKey, COVER_SYSTEM, prompt)
      setCoverLetter(result)
      setShowCover(true)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading('')
    }
  }

  async function copy(text, id) {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(''), 2000)
  }

  const canAnalyse = jobDesc.trim().length > 50 && cvText.trim().length > 50
  const hasKey = !!apiKey

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>

      {/* ── Top bar ── */}
      <div className="navbar no-print" style={{ padding:'0 24px' }}>
        <div className="container" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', height:60 }}>
          <button className="btn-secondary" style={{ padding:'7px 14px', fontSize:13 }} onClick={onBack}>
            <ArrowLeft /> Back
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:22, height:22, borderRadius:6, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <SparkleIcon />
            </div>
            <span style={{ fontWeight:800, fontSize:16 }}>Apply<span className="grad">Edge</span></span>
          </div>
          <button
            className={`btn-secondary`}
            style={{ padding:'7px 14px', fontSize:13, borderColor: hasKey ? 'rgba(16,185,129,0.4)' : 'var(--border-2)', color: hasKey ? '#34d399' : 'var(--text-muted)' }}
            onClick={() => { setShowKeyPanel(!showKeyPanel); setError('') }}
          >
            <KeyIcon />
            {hasKey ? 'API Key ✓' : 'Add API Key'}
          </button>
        </div>
      </div>

      {/* ── API Key panel ── */}
      {showKeyPanel && (
        <div className="fade-in" style={{ background:'var(--surface)', borderBottom:'1px solid var(--border)', padding:'20px 24px' }}>
          <div className="container-sm">
            <p style={{ fontSize:13, color:'var(--text-muted)', marginBottom:12, lineHeight:1.6 }}>
              Add your <strong style={{color:'var(--text)'}}>Anthropic API key</strong> to unlock AI CV rewrites and cover letters.
              Get one free at <a href="https://console.anthropic.com" target="_blank" rel="noopener" style={{color:'#818cf8'}}>console.anthropic.com</a>.
              Your key is stored locally in your browser only — never sent to our servers.
            </p>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              <input
                className="field"
                style={{ flex:1, minWidth:240, resize:'none', height:'auto', padding:'10px 14px' }}
                type="password"
                placeholder="sk-ant-api03-..."
                value={keyInput}
                onChange={e => setKeyInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveKey()}
              />
              <button className="btn-primary" style={{ padding:'10px 18px', fontSize:14 }} onClick={saveKey}>Save key</button>
              {hasKey && <button className="btn-secondary" style={{ padding:'10px 18px', fontSize:14 }} onClick={removeKey}>Remove</button>}
            </div>
          </div>
        </div>
      )}

      <div className="container" style={{ padding:'40px 24px 80px' }}>

        {/* ── Error ── */}
        {error && (
          <div className="fade-in" style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:10, padding:'12px 16px', marginBottom:20, color:'#f87171', fontSize:14 }}>
            {error}
          </div>
        )}

        {/* ── Step indicator ── */}
        <div style={{ display:'flex', alignItems:'center', gap:0, marginBottom:40, overflowX:'auto', paddingBottom:4 }}>
          {[
            { label:'Input', key:'input' },
            { label:'ATS Score', key:'scored' },
            { label:'Optimise', key:'optimising' },
            { label:'Result', key:'result' },
          ].map((s,i,arr) => {
            const keys = ['input','scored','optimising','result']
            const cur = keys.indexOf(step)
            const si  = keys.indexOf(s.key)
            const status = si < cur ? 'done' : si === cur ? 'active' : 'pending'
            return (
              <div key={s.key} style={{ display:'flex', alignItems:'center' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, whiteSpace:'nowrap' }}>
                  <div className={`step-dot ${status}`}>{status==='done' ? '✓' : i+1}</div>
                  <span style={{ fontSize:13, fontWeight:600, color: status==='active'?'var(--text)': status==='done'?'#34d399':'var(--text-muted)' }}>{s.label}</span>
                </div>
                {i < arr.length-1 && (
                  <div style={{ width:32, height:1, background: si < cur ?'#10b981':'var(--border-2)', margin:'0 8px', flexShrink:0 }} />
                )}
              </div>
            )
          })}
        </div>

        {/* ── Input section ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap:20, marginBottom:24 }}>
          {/* Job description */}
          <div>
            <div className="field-label">Job Description</div>
            <textarea
              className="field"
              rows={12}
              placeholder={"Paste the job posting here...\n\nWe're looking for a Senior Software Engineer with experience in React, TypeScript, and AWS. The ideal candidate will have...\n\n(Minimum 50 characters to analyse)"}
              value={jobDesc}
              onChange={e => setJobDesc(e.target.value)}
              disabled={step === 'optimising'}
            />
            <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:6 }}>{jobDesc.length} characters</div>
          </div>

          {/* Current CV */}
          <div>
            <div className="field-label">Your CV / Experience</div>
            <textarea
              className="field"
              rows={12}
              placeholder={"Paste your current CV here, or describe your experience...\n\nExample:\nSoftware Engineer at Acme Corp (2020-2024)\n- Built React dashboard used by 50k users\n- Led migration to TypeScript\n- AWS certified\n\n(Minimum 50 characters to analyse)"}
              value={cvText}
              onChange={e => setCvText(e.target.value)}
              disabled={step === 'optimising'}
            />
            <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:6 }}>{cvText.length} characters</div>
          </div>
        </div>

        {/* ── Analyse button ── */}
        {(step === 'input' || step === 'scored') && (
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            <button
              className="btn-primary"
              onClick={handleAnalyse}
              disabled={!canAnalyse}
            >
              {step === 'scored' ? 'Re-analyse' : 'Get My ATS Score'} <ArrowLeft style={{transform:'scaleX(-1)'}} />
            </button>
            {!canAnalyse && (
              <span style={{ fontSize:13, color:'var(--text-muted)', alignSelf:'center' }}>
                Add job description and CV to continue
              </span>
            )}
          </div>
        )}

        {/* ── Loading ── */}
        {step === 'optimising' && (
          <div className="fade-in card" style={{ display:'flex', alignItems:'center', gap:16, padding:'24px 28px', marginTop:8 }}>
            <div className="spinner" />
            <div>
              <div style={{ fontWeight:600, marginBottom:4 }}>Optimising your CV with Claude AI...</div>
              <div style={{ fontSize:13, color:'var(--text-muted)' }}>Rewriting your experience with ATS-optimised language. This takes 15-30 seconds.</div>
            </div>
          </div>
        )}

        {/* ── Score + Results ── */}
        {(step === 'scored' || step === 'result') && ats && (
          <div ref={resultRef} className="fade-up" style={{ marginTop:32 }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:20, marginBottom:20 }}>

              {/* Score card */}
              <div className="card" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:24, padding:'32px' }}>
                <ATSRing score={ats.score} animate={true} />
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontSize:13, color:'var(--text-muted)', marginBottom:8 }}>
                    Matched <strong style={{color:'var(--text)'}}>{ats.matched.length}</strong> of <strong style={{color:'var(--text)'}}>{ats.total}</strong> job keywords
                  </div>
                  {step === 'scored' && (
                    <div style={{ fontSize:13, color:'var(--text-muted)' }}>
                      {ats.score < 70 ? 'Optimise your CV to significantly improve this score.' : 'Good match! Optimisation can push this higher.'}
                    </div>
                  )}
                  {step === 'result' && (
                    <div style={{ fontSize:13, color:'#34d399', fontWeight:600 }}>
                      ✓ Optimised CV generated
                    </div>
                  )}
                </div>
              </div>

              {/* Keywords */}
              <div className="card" style={{ display:'flex', flexDirection:'column', gap:20 }}>
                {ats.matched.length > 0 && (
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:'#34d399', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:10 }}>
                      ✓ Matched keywords ({ats.matched.length})
                    </div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                      {ats.matched.map(k => <span key={k} className="chip chip-green">{k}</span>)}
                    </div>
                  </div>
                )}
                {ats.missing.length > 0 && (
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:'#f87171', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:10 }}>
                      ✗ Missing keywords ({ats.missing.length})
                    </div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                      {ats.missing.map(k => <span key={k} className="chip chip-red">{k}</span>)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Optimise CTA */}
            {step === 'scored' && (
              <div className="card" style={{ background:'linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.08))', borderColor:'rgba(99,102,241,0.3)', display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:20 }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:17, marginBottom:4 }}>
                    {hasKey ? 'Optimise your CV with Claude AI' : 'Add an API key to unlock AI optimisation'}
                  </div>
                  <div style={{ color:'var(--text-muted)', fontSize:14 }}>
                    {hasKey
                      ? 'Rewrite your CV using ATS-optimised language tailored to this job — in 30 seconds.'
                      : 'Free: ATS score + keywords. Add your Anthropic API key for AI rewrites + cover letters.'}
                  </div>
                </div>
                <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                  {!hasKey && (
                    <button className="btn-secondary" onClick={() => setShowKeyPanel(true)}>
                      <KeyIcon /> Add API Key
                    </button>
                  )}
                  <button
                    className="btn-primary"
                    onClick={handleOptimise}
                    disabled={!hasKey || loading === 'cv'}
                  >
                    {loading === 'cv' ? <><div className="spinner" /> Optimising…</> : <><SparkleIcon /> Optimise My CV</>}
                  </button>
                </div>
              </div>
            )}

            {/* Optimised CV output */}
            {step === 'result' && optimizedCV && (
              <div className="card" style={{ marginTop:4 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:12 }}>
                  <div>
                    <div style={{ fontWeight:700, fontSize:16 }}>Optimised CV</div>
                    <div style={{ fontSize:13, color:'var(--text-muted)', marginTop:2 }}>Rewritten with ATS-optimised language for this role</div>
                  </div>
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    <button className="btn-secondary" style={{ padding:'8px 14px', fontSize:13 }} onClick={() => copy(optimizedCV, 'cv')}>
                      {copied==='cv' ? <><CheckDone /> Copied!</> : <><CopyIcon /> Copy</>}
                    </button>
                    <button className="btn-secondary" style={{ padding:'8px 14px', fontSize:13 }} onClick={() => exportPDF(optimizedCV, 'CV')}>
                      <DownloadIcon /> Export PDF
                    </button>
                    <button
                      className="btn-green"
                      style={{ padding:'8px 16px', fontSize:13 }}
                      onClick={handleCoverLetter}
                      disabled={loading === 'cover'}
                    >
                      {loading === 'cover'
                        ? <><div className="spinner" style={{width:14,height:14}} /> Generating…</>
                        : <><SparkleIcon /> Cover Letter</>}
                    </button>
                  </div>
                </div>
                <div className="cv-output">{optimizedCV}</div>
              </div>
            )}

            {/* Cover letter output */}
            {showCover && coverLetter && (
              <div className="card fade-up" style={{ marginTop:16 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:12 }}>
                  <div>
                    <div style={{ fontWeight:700, fontSize:16 }}>Cover Letter</div>
                    <div style={{ fontSize:13, color:'var(--text-muted)', marginTop:2 }}>Tailored to the job description</div>
                  </div>
                  <div style={{ display:'flex', gap:8 }}>
                    <button className="btn-secondary" style={{ padding:'8px 14px', fontSize:13 }} onClick={() => copy(coverLetter, 'cover')}>
                      {copied==='cover' ? <><CheckDone /> Copied!</> : <><CopyIcon /> Copy</>}
                    </button>
                    <button className="btn-secondary" style={{ padding:'8px 14px', fontSize:13 }} onClick={() => exportPDF(coverLetter, 'Cover Letter')}>
                      <DownloadIcon /> Export PDF
                    </button>
                  </div>
                </div>
                <div className="cv-output">{coverLetter}</div>
              </div>
            )}

          </div>
        )}

        {/* ── Pro tip ── */}
        {step === 'input' && (
          <div style={{ marginTop:32, padding:'16px 20px', borderRadius:12, background:'var(--surface)', border:'1px solid var(--border)', fontSize:13, color:'var(--text-muted)', lineHeight:1.6 }}>
            <strong style={{color:'var(--text)'}}>💡 Pro tip:</strong> Your ATS score is free — no API key needed.
            Add your Anthropic API key (via the button above) to unlock AI rewrites and cover letter generation.
            Keys are stored only in your browser and used directly with Anthropic — we never see them.
          </div>
        )}

      </div>
    </div>
  )
}
