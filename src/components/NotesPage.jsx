import React, { useMemo, useState } from "react"
import { notes } from "../data/notes.js"
import { concepts } from "../data/concepts.js"
import { semesters, subjectOf } from "../data/subjects.js"

// Search over your own notes. Plain filter() + map() — the results update
// as you type because query is controlled state.
export default function NotesPage({ conceptsLiveById, onSelectConcept }) {
  const [query, setQuery] = useState("")
  const [semester, setSemester] = useState("all")
  const [subject, setSubject] = useState("all")
  const [type, setType] = useState("all")

  // subjects that actually appear in the notes data
  const noteSubjects = useMemo(
    () => [...new Set(notes.map((n) => concepts.find((c) => c.id === n.conceptId)?.subject).filter(Boolean))],
    []
  )

  const results = useMemo(
    () =>
      notes.filter((n) => {
        const concept = conceptsLiveById[n.conceptId]
        if (!concept) return false
        if (query.trim() && !n.title.toLowerCase().includes(query.trim().toLowerCase())) return false
        if (semester !== "all" && String(concept.semester) !== String(semester)) return false
        if (subject !== "all" && concept.subject !== subject) return false
        if (type !== "all" && n.type !== type) return false
        return true
      }),
    [query, semester, subject, type, conceptsLiveById]
  )

  return (
    <div className="page">
      <div className="notes-controls">
        <input
          className="notes-search"
          type="text"
          placeholder="Search your academic notes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search your academic notes"
        />
        <select value={semester} onChange={(e) => setSemester(e.target.value)} aria-label="Filter by semester">
          <option value="all">Semester</option>
          {semesters.map((s) => (
            <option key={s.id} value={s.id}>
              Semester {s.id}
            </option>
          ))}
        </select>
        <select value={subject} onChange={(e) => setSubject(e.target.value)} aria-label="Filter by subject">
          <option value="all">Subject</option>
          {noteSubjects.map((id) => (
            <option key={id} value={id}>
              {subjectOf(id)}
            </option>
          ))}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Filter by type">
          <option value="all">Type</option>
          <option value="PDF">PDF</option>
          <option value="Slides">Slides</option>
          <option value="Notebook">Notebook</option>
        </select>
      </div>

      <p className="results-count micro">
        {results.length} result{results.length !== 1 ? "s" : ""}
      </p>

      {results.length === 0 ? (
        <div className="empty-state">
          <h3 className="serif">No notes found.</h3>
          <p>Try another search.</p>
        </div>
      ) : (
        <ul className="note-results">
          {results.map((n) => {
            const concept = conceptsLiveById[n.conceptId]
            return (
              <li key={n.id}>
                <button type="button" className="note-result" onClick={() => onSelectConcept(n.conceptId)}>
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
      )}
    </div>
  )
}