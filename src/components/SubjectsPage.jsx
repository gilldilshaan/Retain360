import React, { useMemo } from "react"
import { subjects, subjectOf } from "../data/subjects.js"

// One card per subject. Clicking a card opens the map pre-filtered to it.
export default function SubjectsPage({ conceptsLive, onOpenSubject }) {
  const cards = useMemo(
    () =>
      subjects.map((s) => {
        const list = conceptsLive.filter((c) => c.subject === s.id)
        const avg = list.length
          ? Math.round(list.reduce((sum, c) => sum + c.retention, 0) / list.length)
          : 0
        return { ...s, count: list.length, avg }
      }),
    [conceptsLive]
  )

  return (
    <div className="page">
      <div className="subject-grid">
        {cards.map((s) => (
          <button
            key={s.id}
            type="button"
            className="subject-card"
            onClick={() => onOpenSubject(s.id)}
            disabled={s.count === 0}
          >
            <span className="micro">{subjectOf(s.id)}</span>
            <span className="subject-count serif">
              {s.count} concept{s.count !== 1 ? "s" : ""}
            </span>
            <span className="subject-avg">avg retention {s.avg}%</span>
          </button>
        ))}
      </div>
    </div>
  )
}