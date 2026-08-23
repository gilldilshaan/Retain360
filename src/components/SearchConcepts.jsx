import React, { useState } from "react"
import { SearchIcon, CloseIcon } from "./Icons.jsx"
import { subjectOf } from "../data/subjects.js"

export default function SearchConcepts({ concepts, onSelect, open, onClose }) {
  const [query, setQuery] = useState("")

  const results = query.trim()
    ? concepts.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase()))
    : []

  const handlePick = (concept) => {
    onSelect(concept.id)
    setQuery("")
    onClose?.()
  }

  return (
    <div className={`search-panel${open ? " open" : ""}`}>
      <div className="search-field">
        <SearchIcon />
        <input
          className="search-input"
          type="text"
          placeholder="Search concepts…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search concepts"
        />
        {query && (
          <button className="search-clear" aria-label="Clear search" onClick={() => setQuery("")}>
            <CloseIcon width={14} height={14} />
          </button>
        )}
      </div>

      {query.trim() && (
        <div className="search-results">
          {results.length === 0 ? (
            <div className="empty">
              <p className="empty-title">No concepts found.</p>
              <p className="empty-sub">Try searching another concept or subject.</p>
            </div>
          ) : (
            results.map((c) => (
              <button key={c.id} className="search-result" onClick={() => handlePick(c)}>
                <span className="result-name">{c.name}</span>
                <span className="result-meta">
                  {subjectOf(c.subject)} · SEM {c.semester}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}