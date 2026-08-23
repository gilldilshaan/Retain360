import React from "react"
import { useNavigate } from "react-router-dom"
import { MapIcon, MemoryIcon, NotesIcon } from "./Icons.jsx"
import { conceptsById } from "../data/concepts.js"
import { subjects } from "../data/subjects.js"

export default function LandingPage() {
  const navigate = useNavigate()

  const chainIds = ["mathematics", "matrix-multiplication", "neural-networks", "machine-learning"]
  const steps = chainIds
    .map((id) => {
      const subject = subjects.find((s) => s.id === id)
      if (subject) return { key: id, label: subject.name, meta: "Subject · Semester 1", pct: null }
      const concept = conceptsById[id]
      if (!concept) return null
      return {
        key: id,
        label: concept.name,
        meta: `Semester ${concept.semester} · ${concept.retention}% retention`,
        pct: concept.retention,
      }
    })
    .filter(Boolean)

  return (
    <div className="landing">
      <header className="landing-top">
        <span className="brand-mark" aria-hidden="true">
          <MapIcon width={20} height={20} />
        </span>
        <span className="brand-name">KINSHIP</span>
      </header>

      <main className="landing-main">
        <h1 className="landing-title serif">
          Your degree.
          <br />
          <em>Connected.</em>
        </h1>

        <p className="landing-quote">
          &ldquo;What you learned in 1st year shouldn&rsquo;t disappear by 4th year.&rdquo;
        </p>

        <ul className="landing-points">
          <li>
            <MapIcon /> Connect your concepts.
          </li>
          <li>
            <NotesIcon /> Rediscover your notes.
          </li>
          <li>
            <MemoryIcon /> Know what to revise.
          </li>
        </ul>

        <div className="chain" aria-label="Example knowledge connection">
          {steps.map((step, i) => (
            <React.Fragment key={step.key}>
              {i > 0 && (
                <span className="chain-arrow" aria-hidden="true">
                  ↓
                </span>
              )}
              <div className="chain-node">
                <span className="chain-copy">
                  <span className="chain-name">{step.label}</span>
                  <span className="chain-meta">{step.meta}</span>
                </span>
                {step.pct !== null && <span className="chain-pct serif">{step.pct}%</span>}
              </div>
            </React.Fragment>
          ))}
        </div>

        <button type="button" className="btn btn-primary landing-cta" onClick={() => navigate("/dashboard")}>
          Enter KINSHIP →
        </button>
      </main>

      <footer className="landing-foot micro">Academic Knowledge Web · Built with React</footer>
    </div>
  )
}
