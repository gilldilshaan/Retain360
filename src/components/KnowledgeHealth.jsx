import React, { useMemo } from "react"
import RetentionIndicator from "./RetentionIndicator.jsx"
import { subjectOf } from "../data/subjects.js"

// A simple health report: one average, three counts, and the fading list.
export default function KnowledgeHealth({ conceptsLive, onSelectConcept }) {
  const report = useMemo(() => {
    const avg = Math.round(conceptsLive.reduce((s, c) => s + c.retention, 0) / conceptsLive.length)
    const strong = conceptsLive.filter((c) => c.status === "strong").length
    const steady = conceptsLive.filter((c) => c.status === "normal").length
    const fading = conceptsLive.filter((c) => c.status === "fading")
    return { avg, strong, steady, fading }
  }, [conceptsLive])

  return (
    <div className="page">
      <section className="stat-cards">
        <div className="stat-card">
          <span className="stat-value serif">{report.avg}%</span>
          <span className="stat-label">Knowledge Health</span>
          <span className="stat-sub">average retention</span>
        </div>
        <div className="stat-card">
          <span className="stat-value serif">{report.strong}</span>
          <span className="stat-label">Strong</span>
          <span className="stat-sub">75% and above</span>
        </div>
        <div className="stat-card">
          <span className="stat-value serif">{report.steady}</span>
          <span className="stat-label">Steady</span>
          <span className="stat-sub">holding between 55–74%</span>
        </div>
        <div className="stat-card">
          <span className="stat-value serif">{report.fading.length}</span>
          <span className="stat-label">Fading</span>
          <span className="stat-sub">below 55%</span>
        </div>
      </section>

      <h3 className="page-section-title serif">Concepts losing strength</h3>

      {report.fading.length === 0 ? (
        <div className="empty-state">
          <h3 className="serif">Nothing is fading.</h3>
          <p>Every concept is holding above 55%.</p>
        </div>
      ) : (
        <ul className="health-list">
          {report.fading.map((c) => (
            <li key={c.id}>
              <button type="button" className="health-row" onClick={() => onSelectConcept(c.id)}>
                <span className="health-name">
                  {c.name}
                  <span className="health-meta">
                    {subjectOf(c.subject)} · Semester {c.semester}
                  </span>
                </span>
                <span className="health-bar">
                  <RetentionIndicator value={c.retention} />
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}