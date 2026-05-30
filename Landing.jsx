import { useState } from 'react'

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8l3.5 3.5L13 4.5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const CrossIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 3l8 8M11 3L3 11" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)
const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const SparkleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 1l1.5 4.5L14 7l-4.5 1.5L8 13l-1.5-4.5L2 7l4.5-1.5L8 1z"/>
  </svg>
)

function ATSRingDemo({ score, label }) {
  const r = 44
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const cls = score >= 70 ? 'score-high' : score >= 40 ? 'score-medium' : 'score-low'
  const txtCls = score >= 70 ? 'score-text-high' : score >= 40 ? 'score-text-medium' : 'score-text-low'
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
      <div style={{ position:'relative', display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
        <svg width="110" height="110" style={{ transform:'rotate(-90deg)' }}>
          <circle cx="55" cy="55" r={r} fill="none" strokeWidth="7" className="ats-ring-track" />
          <circle cx="55" cy="55" r={r} fill="none" strokeWidth="7"
            strokeDasharray={circ} strokeDashoffset={offset}
            className={`ats-ring-fill ${cls}`} />
        </svg>
        <div style={{ position:'absolute', textAlign:'center' }}>
          <div style={{ fontSize:22, fontWeight:800 }} className={txtCls}>{score}%</div>
          <div style={{ fontSize:10, color:'var(--text-muted)', fontWeight:500 }}>ATS</div>
        </div>
      </div>
      <div style={{ fontSize:13, fontWeight:600, color:'var(--text-muted)' }}>{label}</div>
    </div>
  )
}

const FEATURES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="#818cf8"/>
      </svg>
    ),
    title: 'ATS Score Analysis',
    desc: 'Get an instant score showing exactly how likely your CV is to pass automated screening software — no guessing.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Job Description Matching',
    desc: 'Paste any job listing and see exactly which keywords you\'re missing. Every application is tailored, not generic.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="#f472b6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'AI CV Rewrite',
    desc: 'Claude AI rewrites your experience using the exact language recruiters and ATS systems are scanning for.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Cover Letter Generator',
    desc: 'One click to generate a compelling, tailored cover letter that complements your optimized CV perfectly.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    title: 'PDF Export',
    desc: 'Download a clean, ready-to-send PDF with one click. Professional formatting, no watermarks.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Before/After Comparison',
    desc: 'See your original CV alongside the AI-optimized version so you understand every improvement made.',
  },
]

const STEPS = [
  { n: '01', title: 'Paste the job description', desc: 'Copy the job posting you\'re applying for and paste it in. CVapp extracts every keyword the employer cares about.' },
  { n: '02', title: 'Add your CV or experience', desc: 'Paste your existing CV, or describe your experience from scratch. We work with both.' },
  { n: '03', title: 'Get your score and optimized CV', desc: 'Instant ATS score, missing keyword list, and a fully rewritten CV ready to copy or download as PDF.' },
]

const PRICING = [
  {
    name: 'Free',
    price: '£0',
    per: 'forever',
    desc: 'See your ATS score and find out why you\'re being rejected.',
    cta: 'Get My Score Free',
    features: [
      { text: 'ATS score for any job', included: true },
      { text: 'Keyword gap analysis', included: true },
      { text: '2 analyses per month', included: true },
      { text: 'AI CV rewrite', included: false },
      { text: 'Cover letter generator', included: false },
      { text: 'PDF export', included: false },
    ],
    featured: false,
  },
  {
    name: 'Pro',
    price: '£9',
    per: '/month',
    desc: 'Everything you need to land more interviews, consistently.',
    cta: 'Start Pro Free Trial',
    badge: 'Most popular',
    features: [
      { text: 'Unlimited ATS analyses', included: true },
      { text: 'Keyword gap analysis', included: true },
      { text: 'AI CV rewrite (Claude AI)', included: true },
      { text: 'Cover letter generator', included: true },
      { text: 'PDF export', included: true },
      { text: 'Before/after comparison', included: true },
    ],
    featured: true,
  },
  {
    name: 'Agency',
    price: '£29',
    per: '/month',
    desc: 'For recruiters and career coaches handling multiple clients.',
    cta: 'Contact Us',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: '10 seats included', included: true },
      { text: 'Bulk CV processing', included: true },
      { text: 'White-label PDF output', included: true },
      { text: 'Priority support', included: true },
      { text: 'Custom branding', included: true },
    ],
    featured: false,
  },
]

const FAQS = [
  { q: 'What is an ATS and why does it matter?', a: 'An Applicant Tracking System (ATS) is software that most companies use to automatically filter CVs before a human ever sees them. Studies show 75% of CVs are rejected at this stage — often for missing specific keywords, not because the candidate is unqualified.' },
  { q: 'Do I need an account to use it?', a: 'No account needed to get your free ATS score. Just paste your job description and CV and you\'ll see your score instantly.' },
  { q: 'How does the AI rewrite actually work?', a: 'We use Claude (Anthropic\'s AI) with a specialized prompt designed by CV experts. It takes your experience and rewrites it using the exact terminology, keywords, and structure that ATS systems and recruiters respond to — without fabricating anything.' },
  { q: 'Will the AI make things up on my CV?', a: 'No. The AI only rewrites and restructures what you provide. It improves how your experience is expressed, never invents experience you don\'t have.' },
  { q: 'Can I use my own Anthropic API key?', a: 'Yes. Pro users can bring their own Claude API key. This means the AI rewrites run directly on your account with no markup on API costs.' },
  { q: 'Is my CV data safe?', a: 'Your CV and job descriptions are processed in real time and never stored on our servers. API calls go directly to Anthropic from your browser.' },
]

function FAQ() {
  const [open, setOpen] = useState(null)
  return (
    <div>
      {FAQS.map((f, i) => (
        <div key={i} className="faq-item">
          <div className="faq-question" onClick={() => setOpen(open === i ? null : i)}>
            <span>{f.q}</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ transform: open===i?'rotate(180deg)':'none', transition:'transform 0.2s', flexShrink:0 }}>
              <path d="M5 7.5l5 5 5-5" stroke="var(--text-muted)" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          {open === i && <div className="faq-answer fade-in">{f.a}</div>}
        </div>
      ))}
    </div>
  )
}

export default function Landing({ onStart }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── Navbar ── */}
      <nav className="navbar no-print">
        <div className="container" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', height:64 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:8, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <SparkleIcon />
            </div>
            <span style={{ fontWeight:800, fontSize:18, letterSpacing:'-0.02em' }}>CV<span className="grad">app</span></span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:32 }}>
            <a href="#how" style={{ fontSize:14, fontWeight:500, color:'var(--text-muted)', textDecoration:'none' }} className="hidden md:block">How it works</a>
            <a href="#pricing" style={{ fontSize:14, fontWeight:500, color:'var(--text-muted)', textDecoration:'none' }} className="hidden md:block">Pricing</a>
            <button className="btn-primary" style={{ padding:'9px 18px', fontSize:14 }} onClick={onStart}>
              Try Free <ArrowRight />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="grid-bg" style={{ padding:'100px 24px 80px', textAlign:'center', position:'relative', overflow:'hidden' }}>
        {/* Glow blobs */}
        <div style={{ position:'absolute', top:-100, left:'50%', transform:'translateX(-50%)', width:600, height:400, background:'radial-gradient(ellipse,rgba(99,102,241,0.12) 0%,transparent 70%)', pointerEvents:'none' }} />

        <div className="container-sm">
          <div className="hero-badge fade-up">
            <SparkleIcon />
            Free ATS score — no sign-up required
          </div>

          <h1 style={{ fontSize:'clamp(36px,6vw,72px)', fontWeight:900, lineHeight:1.08, letterSpacing:'-0.03em', marginBottom:24 }}>
            Your CV gets rejected<br />
            <span className="grad">by a robot</span><br />
            before a human reads it
          </h1>

          <p style={{ fontSize:'clamp(16px,2vw,20px)', color:'var(--text-muted)', maxWidth:560, margin:'0 auto 40px', lineHeight:1.6 }}>
            75% of CVs are filtered out by Applicant Tracking Systems before a recruiter ever sees them. CVapp shows you your score and fixes it — in 30 seconds.
          </p>

          <div style={{ display:'flex', flexWrap:'wrap', gap:12, justifyContent:'center', marginBottom:64 }}>
            <button className="btn-primary" style={{ fontSize:16, padding:'14px 28px' }} onClick={onStart}>
              Analyse My CV Free <ArrowRight />
            </button>
            <a href="#how" style={{ textDecoration:'none' }}>
              <button className="btn-secondary" style={{ fontSize:16, padding:'14px 28px' }}>
                See how it works
              </button>
            </a>
          </div>

          {/* Before / After demo */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:32, flexWrap:'wrap' }}>
            <div className="card" style={{ padding:'28px 36px', display:'flex', flexDirection:'column', alignItems:'center', gap:16, minWidth:180 }}>
              <ATSRingDemo score={24} label="Before" />
              <div style={{ fontSize:12, color:'var(--text-muted)', textAlign:'center', maxWidth:140 }}>
                Generic CV,<br />no keyword matching
              </div>
            </div>

            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, color:'var(--text-muted)' }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M6 16h20M18 8l8 8-8 8" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span style={{ fontSize:12, fontWeight:600, color:'#6366f1' }}>CVapp</span>
            </div>

            <div className="card glow-green" style={{ padding:'28px 36px', display:'flex', flexDirection:'column', alignItems:'center', gap:16, minWidth:180 }}>
              <ATSRingDemo score={91} label="After" />
              <div style={{ fontSize:12, color:'var(--text-muted)', textAlign:'center', maxWidth:140 }}>
                AI-optimised,<br />keyword-matched CV
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <div style={{ borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)', background:'var(--surface)', padding:'24px' }}>
        <div className="container" style={{ display:'flex', flexWrap:'wrap', justifyContent:'space-around', gap:24, textAlign:'center' }}>
          {[
            { n:'75%', label:'of CVs rejected by ATS before a human sees them' },
            { n:'3×', label:'more likely to get an interview with an optimised CV' },
            { n:'30s', label:'to get your ATS score, free, no sign-up' },
          ].map((s,i) => (
            <div key={i}>
              <div style={{ fontSize:32, fontWeight:900, letterSpacing:'-0.03em' }} className="grad">{s.n}</div>
              <div style={{ fontSize:13, color:'var(--text-muted)', maxWidth:180 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── How it works ── */}
      <section id="how" className="section">
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:64 }}>
            <div className="chip chip-accent" style={{ marginBottom:16 }}>How it works</div>
            <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:800, letterSpacing:'-0.02em', marginBottom:16 }}>
              From rejected to <span className="grad">interview-ready</span>
            </h2>
            <p style={{ color:'var(--text-muted)', fontSize:17, maxWidth:480, margin:'0 auto' }}>
              Three steps. Under two minutes. No sign-up required for the free score.
            </p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:24 }}>
            {STEPS.map((s,i) => (
              <div key={i} className="card card-hover" style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <div style={{ fontSize:48, fontWeight:900, letterSpacing:'-0.04em', lineHeight:1 }} className="grad">{s.n}</div>
                <h3 style={{ fontSize:18, fontWeight:700 }}>{s.title}</h3>
                <p style={{ color:'var(--text-muted)', fontSize:15, lineHeight:1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section" style={{ paddingTop:0 }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:64 }}>
            <div className="chip chip-accent" style={{ marginBottom:16 }}>Features</div>
            <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:800, letterSpacing:'-0.02em' }}>
              Every tool you need to<br /><span className="grad">get hired faster</span>
            </h2>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:20 }}>
            {FEATURES.map((f,i) => (
              <div key={i} className="card card-hover" style={{ display:'flex', flexDirection:'column', gap:12 }}>
                <div style={{ width:44, height:44, borderRadius:12, background:'var(--surface-2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {f.icon}
                </div>
                <h3 style={{ fontWeight:700, fontSize:16 }}>{f.title}</h3>
                <p style={{ color:'var(--text-muted)', fontSize:14, lineHeight:1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="section" style={{ paddingTop:0 }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:64 }}>
            <div className="chip chip-accent" style={{ marginBottom:16 }}>Pricing</div>
            <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:800, letterSpacing:'-0.02em', marginBottom:16 }}>
              Simple, honest pricing
            </h2>
            <p style={{ color:'var(--text-muted)', fontSize:17 }}>
              Start free. Upgrade when you see the value — and you will.
            </p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:24, alignItems:'start' }}>
            {PRICING.map((p,i) => (
              <div key={i} className={`pricing-card${p.featured?' featured':''}`}>
                <div>
                  {p.badge && (
                    <div className="chip chip-accent" style={{ marginBottom:12 }}>{p.badge}</div>
                  )}
                  <div style={{ fontSize:18, fontWeight:700, marginBottom:4 }}>{p.name}</div>
                  <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:8 }}>
                    <span className="price-tag">{p.price}</span>
                    <span style={{ color:'var(--text-muted)', fontSize:16 }}>{p.per}</span>
                  </div>
                  <p style={{ color:'var(--text-muted)', fontSize:14, lineHeight:1.5 }}>{p.desc}</p>
                </div>

                <button
                  className={p.featured ? 'btn-primary' : 'btn-secondary'}
                  style={{ width:'100%', justifyContent:'center' }}
                  onClick={onStart}
                >
                  {p.cta}
                </button>

                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {p.features.map((f,j) => (
                    <div key={j} className={`feature-line${f.included?' included':''}`}>
                      {f.included ? <CheckIcon /> : <CrossIcon />}
                      {f.text}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section" style={{ paddingTop:0 }}>
        <div className="container-sm">
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <div className="chip chip-accent" style={{ marginBottom:16 }}>FAQ</div>
            <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:800, letterSpacing:'-0.02em' }}>
              Questions answered
            </h2>
          </div>
          <FAQ />
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="section-sm">
        <div className="container-sm">
          <div className="card glow-accent" style={{ textAlign:'center', padding:'64px 40px', background:'linear-gradient(180deg,rgba(99,102,241,0.12) 0%,var(--surface) 100%)', borderColor:'rgba(99,102,241,0.3)' }}>
            <h2 style={{ fontSize:'clamp(24px,4vw,40px)', fontWeight:800, letterSpacing:'-0.02em', marginBottom:16 }}>
              Stop applying into<br /><span className="grad">the void</span>
            </h2>
            <p style={{ color:'var(--text-muted)', fontSize:16, marginBottom:32, maxWidth:420, margin:'0 auto 32px' }}>
              Get your free ATS score in 30 seconds. No account required.
            </p>
            <button className="btn-primary" style={{ fontSize:16, padding:'14px 32px' }} onClick={onStart}>
              Analyse My CV Free <ArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop:'1px solid var(--border)', padding:'32px 24px' }}>
        <div className="container" style={{ display:'flex', flexWrap:'wrap', justifyContent:'space-between', alignItems:'center', gap:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:24, height:24, borderRadius:6, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <SparkleIcon />
            </div>
            <span style={{ fontWeight:700, fontSize:16 }}>CV<span className="grad">app</span></span>
          </div>
          <div style={{ color:'var(--text-muted)', fontSize:13 }}>
            © 2025 CVapp. Built with Claude AI.
          </div>
          <div style={{ display:'flex', gap:20 }}>
            {['Privacy','Terms','Contact'].map(l => (
              <a key={l} href="#" style={{ fontSize:13, color:'var(--text-muted)', textDecoration:'none' }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
