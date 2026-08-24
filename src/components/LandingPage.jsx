import React, { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { MapIcon, MemoryIcon, NotesIcon, SearchIcon } from "./Icons.jsx"
import { concepts } from "../data/concepts.js"
import { subjects } from "../data/subjects.js"

// Premium SaaS landing for Retain360.
// One small IntersectionObserver adds `.in` to every [data-reveal] element
// as it scrolls into view — the CSS does the rest.
export default function LandingPage() {
  const navigate = useNavigate()
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const targets = root.querySelectorAll("[data-reveal]")
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.18 }
    )
    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // real numbers from the same mock data the app uses
  const stats = [
    { value: concepts.length, label: "Connected concepts" },
    { value: subjects.length, label: "Subjects mapped" },
    { value: 4, label: "Semesters bridged" },
    {
      value:
        Math.round(concepts.reduce((sum, c) => sum + c.retention, 0) / concepts.length) + "%",
      label: "Average retention",
    },
  ]

  return (
    <div className="landing" ref={rootRef}>
      {/* ── floating pill nav ── */}
      <header className="lnav">
        <button type="button" className="lnav-brand" onClick={() => window.scrollTo({ top: 0 })}>
          <span className="brand-mark"><MapIcon width={17} height={17} /></span>
          <span className="brand-name">RETAIN360</span>
        </button>
        <nav className="lnav-links" aria-label="Landing sections">
          <a href="#product">Product</a>
          <a href="#workflow">How it works</a>
          <a href="#thesis">Why</a>
        </nav>
        <div className="lnav-actions">
          <button type="button" className="lnav-ghost" onClick={() => navigate("/dashboard")}>
            Open App
          </button>
          <button type="button" className="btn btn-primary lnav-cta" onClick={() => navigate("/knowledge")}>
            Launch Map<span className="btn-orb">→</span>
          </button>
        </div>
      </header>

      {/* ── hero ── */}
      <section className="hero">
        <span className="eyebrow-pill" data-reveal>Academic Knowledge Web</span>
        <h1 className="hero-title serif" data-reveal>
          What you learned in 1st year<br />
          shouldn&rsquo;t disappear <em>by 4th.</em>
        </h1>
        <p className="hero-sub" data-reveal>
          Retain360 connects every concept across your degree — so Matrices from semester one
          light the path to Deep Learning in semester four, and you always know what to revise next.
        </p>
        <div className="hero-ctas" data-reveal>
          <button type="button" className="btn btn-primary btn-lg" onClick={() => navigate("/dashboard")}>
            Enter Retain360<span className="btn-orb">→</span>
          </button>
          <button type="button" className="btn btn-outline btn-lg" onClick={() => navigate("/knowledge")}>
            Explore the live map
          </button>
        </div>

        <figure className="hero-demo" data-reveal>
          <img src="/knowledge-chain.svg" alt="A concept chain lighting up across semesters" loading="lazy" />
        </figure>
      </section>

      {/* ── stats band ── */}
      <section className="statband" data-reveal aria-label="Retain360 in numbers">
        {stats.map((s) => (
          <div key={s.label} className="statband-item">
            <span className="statband-value serif">{s.value}</span>
            <span className="statband-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── product bento ── */}
      <section id="product" className="feature-head" data-reveal>
        <span className="micro section-label">The Product</span>
        <h2 className="section-title serif">One map for everything you&rsquo;ve learned</h2>
      </section>

      <section className="bento">
        <article className="bento-card span-7 tall" data-reveal>
          <MiniMap />
          <h3 className="serif">The Knowledge Map</h3>
          <p>
            Every concept is a node. Select Neural Networks and watch Matrices, Derivatives and
            Probability glow behind it — while everything unrelated fades away.
          </p>
        </article>

        <article className="bento-card span-5" data-reveal>
          <span className="micro section-label">Signature</span>
          <h3 className="serif">Knowledge Lineage</h3>
          <div className="lineage-mini" aria-hidden="true">
            <span className="lm-sem">SEM 1</span>
            <span className="lm-node">Matrices</span>
            <span className="lm-arrow">↓</span>
            <span className="lm-node">Matrix Multiplication</span>
            <span className="lm-arrow">↓</span>
            <span className="lm-sem">SEM 3</span>
            <span className="lm-node current">Neural Networks</span>
            <span className="lm-arrow">↓</span>
            <span className="lm-sem">SEM 4</span>
            <span className="lm-node">Deep Learning</span>
          </div>
          <p>Four concepts. Three semesters. One unbroken chain.</p>
        </article>

        <article className="bento-card span-5" data-reveal>
          <span className="micro section-label">Retention</span>
          <h3 className="serif">Know what&rsquo;s fading</h3>
          <div className="debt-mini" aria-hidden="true">
            <span className="dm-label">Matrix Multiplication</span>
            <span className="dm-bar"><i style={{ width: "42%" }} /></span>
            <span className="dm-pct">42%</span>
            <span className="dm-arrow">→ reviewed</span>
            <span className="dm-bar strong"><i style={{ width: "56%" }} /></span>
            <span className="dm-pct good">56%</span>
          </div>
          <p>Weak prerequisites raise a debt flag — refresh them before they sink what&rsquo;s built on top.</p>
        </article>

        <article className="bento-card span-7 wide" data-reveal>
          <div className="wide-copy">
            <h3 className="serif">Everything is one keystroke away</h3>
            <p>Search any concept, jump straight onto the map, open the exact note that explains it.</p>
          </div>
          <div className="kbd-row" aria-hidden="true">
            <span className="kbd-demo"><SearchIcon width={13} height={13} /> neural</span>
            <span className="kbd-key">⌘K</span>
          </div>
        </article>

        <article className="bento-card span-6" data-reveal>
          <MemoryIcon />
          <h3 className="serif">Knowledge Health</h3>
          <p>A living average of how much of your degree you still actually hold.</p>
        </article>

        <article className="bento-card span-6" data-reveal>
          <NotesIcon />
          <h3 className="serif">Notes that find you</h3>
          <p>Filter by semester, subject or type — results land you on the concept itself.</p>
        </article>
      </section>

      {/* ── workflow ── */}
      <section id="workflow" className="feature-head" data-reveal>
        <span className="micro section-label">Workflow</span>
        <h2 className="section-title serif">Three steps, every study session</h2>
      </section>

      <ol className="steps">
        <li data-reveal>
          <span className="step-num serif">01</span>
          <h3>Select a concept</h3>
          <p>Search or click any node on the map — keyboard friendly throughout.</p>
        </li>
        <li data-reveal>
          <span className="step-num serif">02</span>
          <h3>See the connections</h3>
          <p>Prerequisites light up backwards through the years, uses forward.</p>
        </li>
        <li data-reveal>
          <span className="step-num serif">03</span>
          <h3>Refresh what faded</h3>
          <p>A two-minute review updates retention — the whole map feels it.</p>
        </li>
      </ol>

      {/* ── thesis band ── */}
      <section id="thesis" className="thesis" data-reveal>
        <p className="thesis-quote serif">
          &ldquo;Concepts learned years apart<br />were always connected.&rdquo;
        </p>
        <p className="thesis-sub">Retain360 just draws the lines.</p>
        <button type="button" className="btn btn-primary btn-lg" onClick={() => navigate("/dashboard")}>
          Start exploring<span className="btn-orb">→</span>
        </button>
      </section>

      {/* ── footer ── */}
      <footer className="lfoot">
        <span className="brand-name">RETAIN360</span>
        <span className="micro">Academic Knowledge Web · Team Retain360 · B.Tech CSE — AI &amp; ML</span>
      </footer>
    </div>
  )
}

/* Small static illustration of the graph for the bento — pure SVG. */
function MiniMap() {
  return (
    <svg className="minimap" viewBox="0 0 320 190" aria-hidden="true">
      <g stroke="#798165" strokeWidth="1.2" opacity="0.55">
        <line x1="60" y1="45" x2="140" y2="95" />
        <line x1="70" y1="145" x2="140" y2="95" />
        <line x1="140" y1="95" x2="230" y2="60" />
        <line x1="140" y1="95" x2="235" y2="135" strokeDasharray="4 4" />
      </g>
      <g fontSize="9.5" fontWeight="600" fill="#2C2725">
        <circle cx="60" cy="45" r="17" fill="#F6EFDC" stroke="#2C2725" strokeOpacity="0.25" />
        <text x="60" y="48" textAnchor="middle">Calc</text>
        <circle cx="70" cy="145" r="21" fill="#F6EFDC" stroke="#2C2725" strokeOpacity="0.25" />
        <text x="70" y="148" textAnchor="middle">Matrices</text>
        <circle cx="140" cy="95" r="24" fill="#798165" stroke="#5F6750" strokeWidth="1.6" />
        <text x="140" y="98" textAnchor="middle" fill="#F6EFDC">ML</text>
        <circle cx="230" cy="60" r="19" fill="#F6EFDC" stroke="#2C2725" strokeOpacity="0.25" />
        <text x="230" y="63" textAnchor="middle">NN</text>
        <circle cx="235" cy="135" r="17" fill="#F6EFDC" stroke="#2C2725" strokeOpacity="0.25" />
        <text x="235" y="138" textAnchor="middle">SQL</text>
      </g>
    </svg>
  )
}