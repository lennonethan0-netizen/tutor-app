import { useState, useEffect, useRef } from 'react'
import './App.css'

// ── Data ────────────────────────────────────────────────────
const NAV = ['Career', 'Gallery', 'Sponsors', 'Contact']

const STATS = [
  { value: '147', label: 'Races' },
  { value: '23',  label: 'Wins' },
  { value: '61',  label: 'Podiums' },
  { value: '3',   label: 'Championships' },
]

const CAREER = [
  { year: '2018', title: 'Karting Debut',      desc: 'First competitive season in regional karting, claiming 5 race victories and the Junior Cadet title.' },
  { year: '2019', title: 'National Champion',  desc: 'National karting championship at age 15 — 8 wins from 12 rounds, 200+ points lead.' },
  { year: '2020', title: 'Formula 4 Debut',    desc: 'Stepped up to single-seaters, earning Rookie of the Year and 3 podiums in his debut season.' },
  { year: '2021', title: 'F4 Champion',        desc: 'Dominant title campaign — 11 wins, 18 podiums, fastest lap in every venue visited.' },
  { year: '2022', title: 'Formula Regional',   desc: '5 wins and vice-champion in the Formula Regional European Championship. Monza lap record.' },
  { year: '2023', title: 'Formula 3',          desc: '2nd in the F3 World Series. Race winner at Spa, Silverstone, and Monza.' },
  { year: '2024', title: 'Formula 2',          desc: 'Current campaign in Formula 2. Front-running for the title. The journey to F1 continues.' },
]

const GALLERY = [
  { seed: 'racing-action-1', label: 'On Track',   wide: true  },
  { seed: 'motorsport-2',    label: 'Race Day',   wide: false },
  { seed: 'f1-circuit-3',    label: 'Qualifying', wide: false },
  { seed: 'pit-lane-4',      label: 'Pit Stop',   wide: false },
  { seed: 'podium-5',        label: 'Victory',    wide: true  },
  { seed: 'helmet-6',        label: 'Pre-Race',   wide: false },
]

const PERKS = [
  'Livery & helmet branding at every race',
  'Social media activation & digital content',
  'Hospitality at international race weekends',
  'Global broadcast and media exposure',
]

// ── Hooks ────────────────────────────────────────────────────
function useScrolled(threshold = 60) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > threshold)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [threshold])
  return scrolled
}

function useInView(ref, options = { threshold: 0.25 }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, options)
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [ref, options])
  return visible
}

// ── Icons ────────────────────────────────────────────────────
function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 6l3 3 5-6" stroke="#C9A227" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function SuccessIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <circle cx="26" cy="26" r="25" stroke="#C9A227" strokeWidth="1.5"/>
      <path d="M16 26l8 8 12-14" stroke="#C9A227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// ── Navbar ───────────────────────────────────────────────────
function Navbar({ scrolled }) {
  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`} role="navigation" aria-label="Main">
      <a href="#hero" className="navbar__brand" aria-label="Ethan Lennon – Home">
        <span className="navbar__name">Ethan Lennon</span>
        <span className="navbar__sub">Racing Driver</span>
      </a>
      <ul className="navbar__links">
        {NAV.map(l => (
          <li key={l}>
            <a href={`#${l.toLowerCase()}`}>{l}</a>
          </li>
        ))}
      </ul>
      <a href="#contact" className="navbar__cta">Partner Up</a>
    </nav>
  )
}

// ── Hero ─────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="hero" id="hero" aria-label="Introduction">
      <div className="hero__grid"  aria-hidden="true" />
      <div className="hero__glow"  aria-hidden="true" />
      <div className="hero__stripe" aria-hidden="true" />

      <div className="hero__content">
        <div className="hero__badge" aria-label="Current series: Formula 2, 2024 season">
          <span className="hero__badge-dot" aria-hidden="true" />
          Formula 2 &nbsp;·&nbsp; 2024 Season
        </div>

        <h1 className="hero__name">
          <span>Ethan</span>
          <span className="hero__name-accent">Lennon</span>
        </h1>

        <p className="hero__tagline">Born to Race. Built to Win.</p>
        <p className="hero__desc">
          Professional racing driver competing at the pinnacle of junior motorsport.
          3× champion. 147 races. 23 victories. The path to Formula 1 is now.
        </p>

        <div className="hero__ctas">
          <a href="#career" className="btn btn--primary">View Career</a>
          <a href="#sponsors" className="btn btn--ghost">Partner With Me</a>
        </div>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <span>Scroll</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  )
}

// ── Stats ────────────────────────────────────────────────────
function Stats() {
  const ref = useRef(null)
  const visible = useInView(ref)

  return (
    <section className="stats" ref={ref} aria-label="Career statistics">
      <div className="stats__grid">
        {STATS.map(({ value, label }, i) => (
          <div
            key={label}
            className={`stats__cell${visible ? ' stats__cell--in' : ''}`}
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <span className="stats__val" aria-label={`${value} ${label}`}>{value}</span>
            <span className="stats__label" aria-hidden="true">{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Career ───────────────────────────────────────────────────
function Career() {
  return (
    <section className="career" id="career" aria-label="Career timeline">
      <div className="section-header">
        <span className="section-tag">The Journey</span>
        <h2 className="section-title">Career Timeline</h2>
      </div>

      <div className="timeline" role="list">
        <div className="timeline__axis" aria-hidden="true" />
        {CAREER.map(({ year, title, desc }, i) => (
          <article
            key={year}
            role="listitem"
            className={`timeline__entry ${i % 2 === 0 ? 'timeline__entry--l' : 'timeline__entry--r'}`}
          >
            <div className="timeline__dot" aria-hidden="true" />
            <div className="timeline__card">
              <span className="timeline__year">{year}</span>
              <h3 className="timeline__title">{title}</h3>
              <p className="timeline__desc">{desc}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

// ── Gallery ──────────────────────────────────────────────────
function Gallery() {
  return (
    <section className="gallery" id="gallery" aria-label="Photo gallery">
      <div className="section-header">
        <span className="section-tag">Behind the Wheel</span>
        <h2 className="section-title">Gallery</h2>
      </div>

      <div className="gallery__grid">
        {GALLERY.map(({ seed, label, wide }) => (
          <figure
            key={seed}
            className={`gallery__item${wide ? ' gallery__item--wide' : ''}`}
          >
            <img
              src={`https://picsum.photos/seed/${seed}/900/600`}
              alt={label}
              loading="lazy"
              width="900"
              height="600"
            />
            <figcaption className="gallery__cap">
              <span>{label}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

// ── Quote ────────────────────────────────────────────────────
function Quote() {
  return (
    <section className="pullquote" aria-label="Driver quote">
      <div className="pullquote__inner">
        <div className="pullquote__mark" aria-hidden="true" />
        <blockquote className="pullquote__text">
          "Every lap is a commitment.<br />Every race is a statement.<br />
          I don't just want to compete — I want to dominate."
        </blockquote>
        <cite className="pullquote__attr">— Ethan Lennon</cite>
      </div>
    </section>
  )
}

// ── Sponsors ─────────────────────────────────────────────────
function Sponsors() {
  return (
    <section className="sponsors" id="sponsors" aria-label="Sponsorship">
      <div className="sponsors__inner">
        <div>
          <div className="section-header" style={{ textAlign: 'left', marginBottom: 24 }}>
            <span className="section-tag">Partnership</span>
            <h2 className="section-title">Race With Me</h2>
          </div>
          <p className="sponsors__body">
            Align your brand with a rising star in international motorsport.
            Reach millions of passionate fans across global platforms with
            trackside exposure and premium digital partnership opportunities.
          </p>
          <ul className="sponsors__list" aria-label="Partnership benefits">
            {PERKS.map(p => (
              <li key={p}>
                <span className="sponsors__check" aria-hidden="true">
                  <CheckIcon />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <a href="#contact" className="btn btn--primary">Enquire Now</a>
        </div>

        <div className="sponsors__aside">
          <div className="sponsors__ring" aria-label="3× Champion">
            <span className="sponsors__champ-num" aria-hidden="true">3×</span>
            <span className="sponsors__champ-label">Champion</span>
          </div>
          <div className="sponsors__metrics">
            <div className="sponsors__metric">
              <span className="sponsors__metric-val">2.4M</span>
              <span className="sponsors__metric-label">Social Reach</span>
            </div>
            <div className="sponsors__metric">
              <span className="sponsors__metric-val">47</span>
              <span className="sponsors__metric-label">Race Markets</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Contact ──────────────────────────────────────────────────
function Contact() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section className="contact" id="contact" aria-label="Contact">
      <div className="section-header">
        <span className="section-tag">Get In Touch</span>
        <h2 className="section-title">Contact</h2>
      </div>

      <div className="contact__form-wrap">
        {sent ? (
          <div className="contact__success" role="status" aria-live="polite">
            <SuccessIcon />
            <p>Message received. We'll be in touch shortly.</p>
          </div>
        ) : (
          <form className="form" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="name">Name</label>
                <input id="name" type="text" placeholder="Your full name" required autoComplete="name" />
              </div>
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" placeholder="your@email.com" required autoComplete="email" />
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="subject">Enquiry Type</label>
              <select id="subject" required>
                <option value="">Select an option…</option>
                <option>Sponsorship / Partnership</option>
                <option>Media Enquiry</option>
                <option>Team / Management</option>
                <option>Appearance / Event</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                rows={5}
                placeholder="Tell us about your enquiry…"
                required
              />
            </div>
            <button type="submit" className="btn btn--primary btn--full">
              Send Message
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

// ── Footer ───────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <a href="#hero" className="footer__brand" aria-label="Back to top">
          <span className="footer__name">Ethan Lennon</span>
          <span className="footer__tag">Racing Driver</span>
        </a>
        <nav className="footer__nav" aria-label="Footer">
          {NAV.map(l => <a key={l} href={`#${l.toLowerCase()}`}>{l}</a>)}
        </nav>
        <div className="footer__socials" aria-label="Social media">
          {['Instagram', 'X / Twitter', 'YouTube'].map(s => (
            <span key={s} className="footer__social" role="link" tabIndex={0}>{s}</span>
          ))}
        </div>
      </div>
      <div className="footer__bottom">
        <span className="footer__copy">© 2024 Ethan Lennon. All rights reserved.</span>
        <span className="footer__made">Designed for speed.</span>
      </div>
    </footer>
  )
}

// ── App ──────────────────────────────────────────────────────
export default function App() {
  const scrolled = useScrolled()

  return (
    <>
      <a href="#main-content" className="btn btn--primary" style={{ position: 'absolute', left: '-9999px', top: 8, zIndex: 999 }}
         onFocus={e => { e.target.style.left = '8px' }}
         onBlur={e => { e.target.style.left = '-9999px' }}>
        Skip to main content
      </a>
      <Navbar scrolled={scrolled} />
      <main id="main-content">
        <Hero />
        <Stats />
        <Career />
        <Gallery />
        <Quote />
        <Sponsors />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
