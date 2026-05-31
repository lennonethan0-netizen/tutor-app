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
const CheckDone = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8l3.5 3.5L13 4.5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// ── Score Ring ────────────────────────────────────────────────────────
function ScoreRing({ score, animate }) {
  const [display, setDisplay] = useState(animate ? 0 : score)
  const r = 58
  const circ = 2 * Math.PI * r
  const offset = circ - (display / 100) * circ
  const color = display >= 70 ? '#10b981' : display >= 40 ? '#f59e0b' : '#ef4444'
  const label = display >= 70 ? 'Strong CV' : display >= 40 ? 'Needs work' : 'Weak CV'

  useEffect(() => {
    if (!animate) { setDisplay(score); return }
    let start = null
    const to = score
    const step = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / 1400, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(to * ease))
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
            stroke={color} strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round" style={{ transition:'stroke-dashoffset 0.05s linear' }}
          />
        </svg>
        <div style={{ position:'absolute', textAlign:'center' }}>
          <div style={{ fontSize:32, fontWeight:900, color, letterSpacing:'-0.02em' }}>{display}%</div>
          <div style={{ fontSize:11, color:'var(--text-muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em' }}>CV Score</div>
        </div>
      </div>
      <div style={{ fontSize:14, fontWeight:600, color }}>{label}</div>
    </div>
  )
}

// ── CV Quality Score ──────────────────────────────────────────────────
const ACTION_VERBS = ['led','built','designed','developed','managed','created','improved','increased','reduced','launched','delivered','implemented','achieved','drove','coordinated','established','automated','deployed','founded','grew','trained','mentored','negotiated','secured','generated','streamlined','spearheaded','revamped','accelerated','optimised','optimized']

function calcScore(cv) {
  const cvLower = cv.toLowerCase()
  const words = cv.trim().split(/\s+/).length
  let score = 0

  const sectionKeywords = ['experience','education','skills','summary','profile','objective','employment','qualifications','achievements','projects','certifications']
  const foundSections = sectionKeywords.filter(s => cvLower.includes(s))
  score += Math.min(foundSections.length * 8, 30)

  const foundVerbs = ACTION_VERBS.filter(v => cvLower.includes(v))
  score += Math.min(foundVerbs.length * 4, 25)

  const quantPattern = /\d+\s*(%|users|clients|projects|people|million|billion|k\b|sales|revenue|employees|sites|apps|systems|products|countries|years|months)/gi
  const quants = [...(cv.match(quantPattern) || []), ...(cv.match(/\$[\d,]+/g) || [])]
  score += Math.min(quants.length * 6, 25)

  if (words >= 250 && words <= 900) score += 20
  else if (words >= 150 && words <= 1200) score += 12
  else if (words >= 80) score += 5

  return { score: Math.min(score, 100), foundSections, foundVerbs: foundVerbs.slice(0, 8), quants: quants.length, words }
}

// ── Server API calls ──────────────────────────────────────────────────
async function serverCall(endpoint, body) {
  const res = await fetch(`/api/${endpoint}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`)
  return data.result
}

// ── Markdown → HTML ───────────────────────────────────────────────────
function mdToHtml(content) {
  return content
    .replace(/## (.+)/g, '<h2>$1</h2>')
    .replace(/# (.+)/g, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]+?<\/li>)(?!\n<li>)/g, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')
}

// ── CV Preview ────────────────────────────────────────────────────────
function CVPreview({ content }) {
  return <div className="cv-doc" dangerouslySetInnerHTML={{ __html: mdToHtml(content) }} />
}

// ── Recommendation Cards ──────────────────────────────────────────────
function parseRecommendations(text) {
  // Split on --- separators, filter blanks
  const blocks = text.split(/\n?---+\n?/).map(b => b.trim()).filter(Boolean)
  return blocks.map(block => {
    const sectionMatch = block.match(/\*\*(.+?)\*\*/)
    const originalMatch = block.match(/Original:\s*"?(.+?)"?\s*(?:\n|$)/i)
    const problemMatch  = block.match(/Problem:\s*(.+?)(?:\n|$)/i)
    const improvedMatch = block.match(/Improved:\s*"?(.+?)"?\s*$/is)
    if (!sectionMatch && !improvedMatch) return null
    return {
      section:  sectionMatch?.[1]  || 'Suggestion',
      original: originalMatch?.[1] || null,
      problem:  problemMatch?.[1]  || null,
      improved: improvedMatch?.[1]?.trim() || null,
    }
  }).filter(Boolean)
}

function Recommendations({ content, onCopy, copied }) {
  const recs = parseRecommendations(content)
  if (recs.length === 0) {
    // Fallback: just render as plain text if parsing fails
    return <div style={{ fontSize:14, color:'var(--text)', lineHeight:1.8, whiteSpace:'pre-wrap' }}>{content}</div>
  }
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      {recs.map((r, i) => (
        <div key={i} style={{ border:'1px solid var(--border-2)', borderRadius:12, overflow:'hidden' }}>
          {/* Header */}
          <div style={{ background:'var(--surface-2)', padding:'10px 16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span style={{ fontWeight:700, fontSize:13, color:'var(--text)', textTransform:'uppercase', letterSpacing:'0.05em' }}>
              {r.section}
            </span>
            <span style={{ fontSize:11, color:'var(--text-muted)', fontWeight:600 }}>#{i + 1}</span>
          </div>
          <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:12 }}>
            {/* Original */}
            {r.original && (
              <div style={{ background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:8, padding:'10px 14px' }}>
                <div style={{ fontSize:11, fontWeight:700, color:'#f87171', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:5 }}>What you wrote</div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.7)', fontStyle:'italic' }}>"{r.original}"</div>
              </div>
            )}
            {/* Problem */}
            {r.problem && (
              <div style={{ fontSize:13, color:'var(--text-muted)', lineHeight:1.6 }}>{r.problem}</div>
            )}
            {/* Improved */}
            {r.improved && (
              <div style={{ background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.25)', borderRadius:8, padding:'10px 14px' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:5 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:'#34d399', textTransform:'uppercase', letterSpacing:'0.06em' }}>Say this instead</div>
                  <button
                    onClick={() => onCopy(r.improved, `rec-${i}`)}
                    style={{ background:'none', border:'none', cursor:'pointer', color:'#34d399', fontSize:12, display:'flex', alignItems:'center', gap:4, padding:'2px 6px', borderRadius:4, transition:'background 0.15s' }}
                  >
                    {copied === `rec-${i}` ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.85)', lineHeight:1.6 }}>"{r.improved}"</div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Export PDF ────────────────────────────────────────────────────────
function exportPDF(content, type = 'CV') {
  const w = window.open('', '_blank')
  const md = content
    .replace(/## (.+)/g, '<h2 style="font-size:13pt;font-weight:700;border-bottom:1px solid #333;padding-bottom:3px;margin:16px 0 8px;text-transform:uppercase;letter-spacing:0.04em">$1</h2>')
    .replace(/# (.+)/g, '<h1 style="font-size:18pt;font-weight:700;margin-bottom:4px">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li style="margin:3px 0">$1</li>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>')
  w.document.write(`<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>${type}</title>
<style>
  body { font-family: 'Calibri', Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #000; padding: 40px; max-width: 700px; margin: 0 auto; }
  h1 { font-size: 18pt; font-weight: 700; margin-bottom: 4px; }
  h2 { font-size: 11pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; border-bottom: 1px solid #333; padding-bottom: 3px; margin: 16px 0 8px; }
  li { margin: 3px 0; } ul { padding-left: 20px; }
  @media print { body { padding: 20px; } }
</style></head>
<body>${md}</body></html>`)
  w.document.close()
  setTimeout(() => { w.focus(); w.print() }, 400)
}

// ── Step Indicator ────────────────────────────────────────────────────
function StepIndicator({ steps, current }) {
  const cur = steps.findIndex(x => x.key === current)
  return (
    <div style={{ display:'flex', alignItems:'center', gap:0, marginBottom:40, overflowX:'auto', paddingBottom:4 }}>
      {steps.map((s, i, arr) => {
        const status = i < cur ? 'done' : i === cur ? 'active' : 'pending'
        return (
          <div key={s.key} style={{ display:'flex', alignItems:'center' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, whiteSpace:'nowrap' }}>
              <div className={`step-dot ${status}`}>{status === 'done' ? '✓' : i + 1}</div>
              <span style={{ fontSize:13, fontWeight:600, color: status === 'active' ? 'var(--text)' : status === 'done' ? '#34d399' : 'var(--text-muted)' }}>{s.label}</span>
            </div>
            {i < arr.length - 1 && (
              <div style={{ width:32, height:1, background: i < cur ? '#10b981' : 'var(--border-2)', margin:'0 8px', flexShrink:0 }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Main Tool ─────────────────────────────────────────────────────────
export default function Tool({ onBack }) {
  const [mode, setMode] = useState('rate')  // 'rate' | 'generate'

  // Rate mode
  const [step, setStep] = useState('input')  // input | scored | improving | result
  const [cvText, setCvText] = useState('')
  const [scoreData, setScoreData] = useState(null)
  const [improvedCV, setImprovedCV] = useState('')

  // Generate mode
  const [genInput, setGenInput] = useState('')
  const [genStep, setGenStep] = useState('input')  // input | generating | result
  const [generatedCV, setGeneratedCV] = useState('')

  // Shared
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')
  const resultRef = useRef(null)

  function switchMode(m) { setMode(m); setError('') }

  function handleRate() {
    if (cvText.trim().length < 50) { setError('Please paste your CV (at least 50 characters).'); return }
    setError('')
    setScoreData(calcScore(cvText))
    setStep('scored')
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior:'smooth', block:'start' }), 100)
  }

  async function handleImprove() {
    setLoading(true)
    setError('')
    setStep('improving')
    try {
      const result = await serverCall('optimize', { cvText })
      setImprovedCV(result)
      setStep('result')
    } catch (e) {
      setError(e.message)
      setStep('scored')
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerate() {
    if (genInput.trim().length < 50) { setError('Please describe your experience (at least 50 characters).'); return }
    setGenStep('generating')
    setError('')
    try {
      const result = await serverCall('generate', { experience: genInput })
      setGeneratedCV(result)
      setGenStep('result')
    } catch (e) {
      setError(e.message)
      setGenStep('input')
    }
  }

  async function copy(text, id) {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(''), 2000)
  }

  const rateSteps = [
    { label:'Input', key:'input' },
    { label:'CV Score', key:'scored' },
    { label:'Analysing', key:'improving' },
    { label:'Recommendations', key:'result' },
  ]
  const genSteps = [
    { label:'Your Experience', key:'input' },
    { label:'Generating', key:'generating' },
    { label:'Your CV', key:'result' },
  ]

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
            <span style={{ fontWeight:800, fontSize:16 }}>CV<span className="grad">app</span></span>
          </div>
          <div style={{ width:80 }} />
        </div>
      </div>

      <div className="container" style={{ padding:'40px 24px 80px' }}>

        {/* ── Mode Toggle ── */}
        <div className="no-print" style={{ display:'flex', gap:4, background:'var(--surface-2)', borderRadius:12, padding:4, width:'fit-content', marginBottom:32 }}>
          {[{ key:'rate', label:'Rate My CV' }, { key:'generate', label:'Generate CV' }].map(m => (
            <button key={m.key} onClick={() => switchMode(m.key)} style={{
              padding:'8px 22px', borderRadius:9, fontSize:14, fontWeight:600, border:'none', cursor:'pointer',
              background: mode === m.key ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'transparent',
              color: mode === m.key ? '#fff' : 'var(--text-muted)',
              transition:'all 0.2s',
            }}>
              {m.label}
            </button>
          ))}
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="fade-in" style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:10, padding:'12px 16px', marginBottom:20, color:'#f87171', fontSize:14 }}>
            {error}
          </div>
        )}

        {/* ══════════════════════════════════════════ */}
        {/* RATE MODE                                  */}
        {/* ══════════════════════════════════════════ */}
        {mode === 'rate' && (
          <>
            <StepIndicator steps={rateSteps} current={step} />

            {/* CV input */}
            <div style={{ maxWidth:680, marginBottom:24 }}>
              <div className="field-label">Your CV</div>
              <textarea
                className="field"
                rows={14}
                placeholder={"Paste your CV here...\n\nExample:\nJane Smith\nSoftware Engineer\n\nExperience\nAcme Corp (2020–2024)\n- Built React dashboard used by 50k users\n- Led migration to TypeScript\n- AWS certified\n\nEducation\nBSc Computer Science, UCT (2016–2020)"}
                value={cvText}
                onChange={e => setCvText(e.target.value)}
                disabled={step === 'improving'}
              />
              <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:6 }}>{cvText.length} characters</div>
            </div>

            {/* Rate button */}
            {(step === 'input' || step === 'scored') && (
              <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                <button className="btn-primary" onClick={handleRate} disabled={cvText.trim().length < 50}>
                  {step === 'scored' ? 'Re-rate' : 'Rate My CV'}
                </button>
                {cvText.trim().length < 50 && (
                  <span style={{ fontSize:13, color:'var(--text-muted)', alignSelf:'center' }}>Paste your CV to continue</span>
                )}
              </div>
            )}

            {/* Analysing spinner */}
            {step === 'improving' && (
              <div className="fade-in card" style={{ display:'flex', alignItems:'center', gap:16, padding:'24px 28px', marginTop:8 }}>
                <div className="spinner" />
                <div>
                  <div style={{ fontWeight:600, marginBottom:4 }}>Analysing your CV with Claude AI...</div>
                  <div style={{ fontSize:13, color:'var(--text-muted)' }}>Finding exactly what to change and how to say it better. Takes 15–30 seconds.</div>
                </div>
              </div>
            )}

            {/* Score + Results */}
            {(step === 'scored' || step === 'result') && scoreData && (
              <div ref={resultRef} className="fade-up" style={{ marginTop:32 }}>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:20, marginBottom:20 }}>

                  {/* Score card */}
                  <div className="card" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:24, padding:'32px' }}>
                    <ScoreRing score={scoreData.score} animate={true} />
                    <div style={{ textAlign:'center' }}>
                      <div style={{ fontSize:13, color:'var(--text-muted)', marginBottom:8 }}>
                        Based on structure, action verbs &amp; achievements
                      </div>
                      {step === 'scored' && (
                        <div style={{ fontSize:13, color:'var(--text-muted)' }}>
                          {scoreData.score < 70 ? 'AI can rewrite your CV to make it much more impactful.' : 'Solid CV! AI can polish it even further.'}
                        </div>
                      )}
                      {step === 'result' && (
                        <div style={{ fontSize:13, color:'#34d399', fontWeight:600 }}>✓ Recommendations ready</div>
                      )}
                    </div>
                  </div>

                  {/* Quality metrics */}
                  <div className="card" style={{ display:'flex', flexDirection:'column', gap:20 }}>
                    <div>
                      <div style={{ fontSize:12, fontWeight:700, color:'#34d399', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:12 }}>
                        CV Analysis
                      </div>
                      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                        <div style={{ fontSize:13 }}>
                          <span style={{ color:'var(--text-muted)' }}>Sections: </span>
                          <strong style={{ color:'var(--text)' }}>
                            {scoreData.foundSections.length > 0 ? scoreData.foundSections.join(', ') : 'None detected'}
                          </strong>
                        </div>
                        <div style={{ fontSize:13 }}>
                          <span style={{ color:'var(--text-muted)' }}>Action verbs: </span>
                          <strong style={{ color:'var(--text)' }}>
                            {scoreData.foundVerbs.length > 0 ? scoreData.foundVerbs.join(', ') : 'None detected'}
                          </strong>
                        </div>
                        <div style={{ fontSize:13 }}>
                          <span style={{ color:'var(--text-muted)' }}>Quantified results: </span>
                          <strong style={{ color:'var(--text)' }}>
                            {scoreData.quants > 0 ? `${scoreData.quants} found` : 'None detected'}
                          </strong>
                        </div>
                        <div style={{ fontSize:13 }}>
                          <span style={{ color:'var(--text-muted)' }}>Word count: </span>
                          <strong style={{ color:'var(--text)' }}>{scoreData.words} words </strong>
                          <span style={{ fontSize:12, color: scoreData.words < 200 ? '#f87171' : scoreData.words > 1000 ? '#f59e0b' : '#34d399' }}>
                            {scoreData.words < 200 ? '(too short)' : scoreData.words > 1000 ? '(may be long)' : '(good)'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {(scoreData.quants === 0 || scoreData.foundVerbs.length < 4 || scoreData.foundSections.length < 3 || scoreData.words < 200) && (
                      <div>
                        <div style={{ fontSize:12, fontWeight:700, color:'#f59e0b', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:10 }}>
                          Tips
                        </div>
                        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                          {scoreData.quants === 0 && <div style={{ fontSize:13, color:'var(--text-muted)' }}>• Add numbers to achievements (e.g. "increased sales by 30%")</div>}
                          {scoreData.foundVerbs.length < 4 && <div style={{ fontSize:13, color:'var(--text-muted)' }}>• Use more action verbs: led, built, delivered, achieved…</div>}
                          {scoreData.foundSections.length < 3 && <div style={{ fontSize:13, color:'var(--text-muted)' }}>• Add clear headings: Experience, Skills, Education</div>}
                          {scoreData.words < 200 && <div style={{ fontSize:13, color:'var(--text-muted)' }}>• Expand your CV — aim for 300–700 words</div>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Get Recommendations CTA */}
                {step === 'scored' && (
                  <div className="card" style={{ background:'linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.08))', borderColor:'rgba(99,102,241,0.3)', display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:20 }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:17, marginBottom:4 }}>Get AI recommendations</div>
                      <div style={{ color:'var(--text-muted)', fontSize:14 }}>Claude will read your CV and tell you exactly what to change — with specific better phrasings you can copy.</div>
                    </div>
                    <button className="btn-primary" onClick={handleImprove} disabled={loading}>
                      {loading ? <><div className="spinner" /> Analysing…</> : <><SparkleIcon /> Get Recommendations</>}
                    </button>
                  </div>
                )}

                {/* Recommendations output */}
                {step === 'result' && improvedCV && (
                  <div className="card" style={{ marginTop:4 }}>
                    <div style={{ marginBottom:20 }}>
                      <div style={{ fontWeight:700, fontSize:16, marginBottom:4 }}>CV Recommendations</div>
                      <div style={{ fontSize:13, color:'var(--text-muted)' }}>Specific changes with better phrasings — copy each one directly into your CV</div>
                    </div>
                    <Recommendations content={improvedCV} onCopy={copy} copied={copied} />
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ══════════════════════════════════════════ */}
        {/* GENERATE MODE                              */}
        {/* ══════════════════════════════════════════ */}
        {mode === 'generate' && (
          <>
            <StepIndicator steps={genSteps} current={genStep} />

            <div style={{ marginBottom:24, maxWidth:720 }}>
              <div style={{ background:'linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.06))', border:'1px solid rgba(99,102,241,0.2)', borderRadius:12, padding:'16px 20px', marginBottom:24, fontSize:14, color:'var(--text-muted)', lineHeight:1.6 }}>
                <strong style={{ color:'var(--text)' }}>How it works:</strong> Describe your work history, skills, education, and achievements in plain language — no formatting needed. Claude will turn it into a polished, professional CV.
              </div>

              <div className="field-label">Your Experience &amp; Background</div>
              <textarea
                className="field"
                rows={16}
                placeholder={"Just tell us what you've done — no need to format it:\n\nI worked at Acme Corp for 4 years as a software engineer. I built a customer dashboard using React that was used by 50,000 users. I also led the migration from JavaScript to TypeScript which reduced bugs by 40%.\n\nBefore that I did a Computer Science degree at UCT (2015–2019), graduated with distinction.\n\nSkills: React, TypeScript, Node.js, AWS, Python, SQL\n\nI'm good at leading small teams and have mentored 3 junior developers."}
                value={genInput}
                onChange={e => setGenInput(e.target.value)}
                disabled={genStep === 'generating'}
              />
              <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:6 }}>{genInput.length} characters</div>
            </div>

            {genStep === 'input' && (
              <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                <button className="btn-primary" onClick={handleGenerate} disabled={genInput.trim().length < 50}>
                  <SparkleIcon /> Generate My CV
                </button>
                {genInput.trim().length < 50 && (
                  <span style={{ fontSize:13, color:'var(--text-muted)', alignSelf:'center' }}>Describe your experience to continue</span>
                )}
              </div>
            )}

            {genStep === 'generating' && (
              <div className="fade-in card" style={{ display:'flex', alignItems:'center', gap:16, padding:'24px 28px', marginTop:8 }}>
                <div className="spinner" />
                <div>
                  <div style={{ fontWeight:600, marginBottom:4 }}>Generating your CV with Claude AI...</div>
                  <div style={{ fontSize:13, color:'var(--text-muted)' }}>Turning your experience into a professional CV. Takes 15–30 seconds.</div>
                </div>
              </div>
            )}

            {genStep === 'result' && generatedCV && (
              <div className="card fade-up" style={{ marginTop:8 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:12 }}>
                  <div>
                    <div style={{ fontWeight:700, fontSize:16 }}>Your Generated CV</div>
                    <div style={{ fontSize:13, color:'var(--text-muted)', marginTop:2 }}>Professional CV created from your experience</div>
                  </div>
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    <button className="btn-secondary" style={{ padding:'8px 14px', fontSize:13 }} onClick={() => copy(generatedCV, 'gen')}>
                      {copied === 'gen' ? <><CheckDone /> Copied!</> : <><CopyIcon /> Copy</>}
                    </button>
                    <button className="btn-secondary" style={{ padding:'8px 14px', fontSize:13 }} onClick={() => exportPDF(generatedCV, 'CV')}>
                      <DownloadIcon /> Export PDF
                    </button>
                    <button className="btn-primary" style={{ padding:'8px 16px', fontSize:13 }}
                      onClick={() => { setGenStep('input'); setGeneratedCV(''); setError('') }}>
                      Start Over
                    </button>
                  </div>
                </div>
                <CVPreview content={generatedCV} />
              </div>
            )}
          </>
        )}

      </div>
    </div>
  )
}
