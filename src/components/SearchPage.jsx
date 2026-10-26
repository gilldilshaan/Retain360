import React, { useMemo, useState } from "react"
import { notes } from "../data/notes.js"
import { semesters, subjectOf } from "../data/subjects.js"
import { useApp } from "../context/AppContext.jsx"

const SUGGESTIONS = ["Neural Networks", "Matrices", "SQL", "Recursion"]

export default function SearchPage(props = {}) {
  const context = useApp()
  const conceptsLiveById = props.conceptsLiveById ?? context.conceptsLiveById
  const onExplore = props.onExplore ?? context.goToConcept
  const [query, setQuery] = useState("")
  const [scope, setScope] = useState("all")
  const [semester, setSemester] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("relevance")

  const q = query.trim().toLowerCase()
  const hasActiveFilter = Boolean(q || semester !== "all" || statusFilter !== "all")
  const canResetFilters = Boolean(q || scope !== "all" || semester !== "all" || statusFilter !== "all" || sortBy !== "relevance")

  const resetFilters = () => {
    setQuery("")
    setScope("all")
    setSemester("all")
    setStatusFilter("all")
    setSortBy("relevance")
  }

  const conceptResults = useMemo(() => {
    if (!hasActiveFilter || scope === "notes") return []
    const list = Object.values(conceptsLiveById).filter((c) => {
      if (!c) return false

      // Match query against concept name, description, subject id, and human-readable subject name
      if (q) {
        const nameMatch = c.name?.toLowerCase().includes(q)
        const descMatch = c.description?.toLowerCase().includes(q)
        const subjCodeMatch = c.subject?.toLowerCase().includes(q)
        const subjNameMatch = subjectOf(c.subject)?.toLowerCase().includes(q)
        if (!nameMatch && !descMatch && !subjCodeMatch && !subjNameMatch) return false
      }

      // Filter by semester
      if (semester !== "all" && String(c.semester) !== String(semester)) return false

      // Filter by retention status
      if (statusFilter !== "all") {
        const cStatus = c.status || (c.retention >= 75 ? "strong" : c.retention >= 55 ? "normal" : "fading")
        if (cStatus !== statusFilter) return false
      }

      return true
    })

    // Sort without mutating original array
    if (sortBy === "name-asc") {
      return [...list].sort((a, b) => (a.name || "").localeCompare(b.name || ""))
    }
    if (sortBy === "retention-asc") {
      return [...list].sort((a, b) => (a.retention ?? 0) - (b.retention ?? 0))
    }
    if (sortBy === "retention-desc") {
      return [...list].sort((a, b) => (b.retention ?? 0) - (a.retention ?? 0))
    }
    return list
  }, [q, scope, semester, statusFilter, sortBy, conceptsLiveById, hasActiveFilter])

  const noteResults = useMemo(() => {
    if (!hasActiveFilter || scope === "concepts") return []
    const list = notes.filter((n) => {
      const concept = conceptsLiveById[n.conceptId]
      if (!concept) return false

      // Match query against note title, note body, concept name, and subject name
      if (q) {
        const titleMatch = n.title?.toLowerCase().includes(q)
        const bodyMatch = n.body?.toLowerCase().includes(q)
        const conceptNameMatch = concept.name?.toLowerCase().includes(q)
        const subjNameMatch = subjectOf(concept.subject)?.toLowerCase().includes(q)
        if (!titleMatch && !bodyMatch && !conceptNameMatch && !subjNameMatch) return false
      }

      // Filter by semester
      if (semester !== "all" && String(concept.semester) !== String(semester)) return false

      // Filter by status
      if (statusFilter !== "all") {
        const nStatus = concept.status || (concept.retention >= 75 ? "strong" : concept.retention >= 55 ? "normal" : "fading")
        if (nStatus !== statusFilter) return false
      }

      return true
    })

    // Sort notes without mutating original array
    if (sortBy === "name-asc") {
      return [...list].sort((a, b) => (a.title || "").localeCompare(b.title || ""))
    }
    if (sortBy === "retention-asc") {
      return [...list].sort((a, b) => {
        const retA = conceptsLiveById[a.conceptId]?.retention ?? 0
        const retB = conceptsLiveById[b.conceptId]?.retention ?? 0
        return retA - retB
      })
    }
    if (sortBy === "retention-desc") {
      return [...list].sort((a, b) => {
        const retA = conceptsLiveById[a.conceptId]?.retention ?? 0
        const retB = conceptsLiveById[b.conceptId]?.retention ?? 0
        return retB - retA
      })
    }
    return list
  }, [q, scope, semester, statusFilter, sortBy, conceptsLiveById, hasActiveFilter])

  const total = conceptResults.length + noteResults.length

  return (
    <div className="page">
      <div className="sp-controls">
        <input
          className="notes-search"
          type="text"
          placeholder="Search concepts, notes, subjects, and topics…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search concepts, notes, subjects, and topics"
        />
        <select value={scope} onChange={(e) => setScope(e.target.value)} aria-label="Filter search scope">
          <option value="all">Everything</option>
          <option value="concepts">Concepts Only</option>
          <option value="notes">Notes Only</option>
        </select>
        <select value={semester} onChange={(e) => setSemester(e.target.value)} aria-label="Filter by semester">
          <option value="all">All Semesters</option>
          {semesters.map((s) => (
            <option key={s.id} value={s.id}>
              Semester {s.id}
            </option>
          ))}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by retention status">
          <option value="all">All Statuses</option>
          <option value="fading">Fading (&lt; 55%)</option>
          <option value="normal">Steady (55–74%)</option>
          <option value="strong">Strong (75%+)</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort search results">
          <option value="relevance">Default Sort</option>
          <option value="name-asc">Alphabetical (A–Z)</option>
          <option value="retention-asc">Lowest Retention First</option>
          <option value="retention-desc">Highest Retention First</option>
        </select>
      </div>

      {hasActiveFilter && (
        <div className="search-summary-row">
          <p className="results-count micro">
            {total} result{total !== 1 ? "s" : ""}
            {query.trim() && ` for “${query.trim()}”`}
            {semester !== "all" && ` · SEM ${semester}`}
            {statusFilter !== "all" && ` · ${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}`}
            {sortBy !== "relevance" && ` · ${sortBy === "name-asc" ? "A–Z" : sortBy === "retention-asc" ? "Lowest Retention" : "Highest Retention"}`}
          </p>
          {canResetFilters && (
            <button type="button" className="link-btn clear-filters-btn" onClick={resetFilters}>
              Clear all filters
            </button>
          )}
        </div>
      )}

      {!hasActiveFilter && (
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
          <h3 className="page-section-title serif">Concepts ({conceptResults.length})</h3>
          <ul className="note-results">
            {conceptResults.map((c) => (
              <li key={c.id}>
                <button type="button" className="note-result" onClick={() => onExplore(c.id)}>
                  <span className="nr-title">{c.name}</span>
                  <span className="nr-meta">
                    {subjectOf(c.subject)} · Semester {c.semester} · {c.retention}% retention · {c.status}
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
          <h3 className="page-section-title serif">Notes ({noteResults.length})</h3>
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

      {hasActiveFilter && total === 0 && (
        <div className="empty-state">
          <h3 className="serif">Nothing found.</h3>
          <p>No concepts or notes match your current search terms and active filters.</p>
          <button type="button" className="btn btn-quiet" onClick={resetFilters}>
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )
}
