import React, { useMemo, useState } from "react"
import { notes } from "../data/notes.js"
import { subjectOf } from "../data/subjects.js"

const SUGGESTIONS = ["Neural Networks", "Matrices", "SQL", "Recursion"]

export default function SearchPage({ conceptsLiveById, onExplore }) {
  const [query, setQuery] = useState("")
  const [scope, setScope] = useState("all")

  const q = query.trim().toLowerCase()

  const conceptResults = useMemo(() => {
    if (!q || scope === "notes") return []
    return Object.values(conceptsLiveById).filter((c) => c.name.toLowerCase().includes(q))
  }, [q, scope, conceptsLiveById])

  const noteResults = useMemo(() => {
    if (!q || scope === "concepts") return []
    return notes.filter((n) => {
      const concept = conceptsLiveById[n.conceptId]
      if (!concept) return false
      return (
        n.title.toLowerCase().includes(q) ||
        n.body.toLowerCase().includes(q) ||
        concept.name.toLowerCase().includes(q)
      )
    })
  }, [q, scope, conceptsLiveById])

  const total = conceptResults.length + noteResults.length

  return (
    <div className="page">
      <div className="sp-controls">
        <input
          className="notes-search"
          type="text"
          placeholder="Search concepts and notes…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search concepts and notes"
        />
        <select value={scope} onChange={(e) => setScope(e.target.value)} aria-label="Filter search scope">
          <option value="all">Everything</option>
          <option value="concepts">Concepts</option>
          <option value="notes">Notes</option>
        </select>
      </div>

      {query.trim() && (
        <p className="results-count micro">
          {total} result{total !== 1 ? "s" : ""} for “{query.trim()}”
        </p>
      )}

      {!query.trim() && (
        <>
          <div className="empty-state">
            <h3 className="serif">Search your whole degree.</h3>
            <p>Find a concept on the map, or rediscover a note you already wrote.</p>
          </div>
          <div className="chips-row">
            <span className="micro">Try:</span>
            {SUGGESTIONS.filter((s) => conceptsLiveById[s.toLowerCase().replace(/\s+/g, "-")]).map((s) => (
              <button key={s} type="button" className="chip" onClick={() => setQuery(s)}>
                {s}
              </button>
            ))}
          </div>
        </>
      )}

      {conceptResults.length > 0 && (
        <>
          <h3 className="page-section-title serif">Concepts</h3>
          <ul className="note-results">
            {conceptResults.map((c) => (
              <li key={c.id}>
                <button type="button" className="note-result" onClick={() => onExplore(c.id)}>
                  <span className="nr-title">{c.name}</span>
                  <span className="nr-meta">
                    {subjectOf(c.subject)} · Semester {c.semester} · {c.retention}% retention
                  </span>
                  <span className="nr-snippet">{c.description}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {noteResults.length > 0 && (
        <>
          <h3 className="page-section-title serif">Notes</h3>
          <ul className="note-results">
            {noteResults.map((n) => {
              const concept = conceptsLiveById[n.conceptId]
              return (
                <li key={n.id}>
                  <button type="button" className="note-result" onClick={() => onExplore(n.conceptId)}>
                    <span className="nr-title">{n.title}</span>
                    <span className="nr-meta">
                      {concept.name} · {subjectOf(concept.subject)} · Semester {concept.semester}
                    </span>
                    <span className="nr-source">
                      {n.type} · {n.source}
                    </span>
                    <span className="nr-snippet">“{n.body.slice(0, 90)}…”</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </>
      )}

      {query.trim() && total === 0 && (
        <div className="empty-state">
          <h3 className="serif">Nothing found.</h3>
          <p>Try another concept or note keyword.</p>
        </div>
      )}
    </div>
  )
}
