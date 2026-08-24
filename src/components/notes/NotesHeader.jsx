import React from "react"
import { Search, X } from "lucide-react"

// Notes hero + search + recent searches.
export default function NotesHeader({ query, setQuery, recentSearches, setRecentSearches, onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch()
  }

  return (
    <header className="nlib-header">
      <div className="eyebrow">RETAIN360</div>

      <h1>Every note you&rsquo;ve ever written, one search away.</h1>

      <p className="subhead">Your semesters change. Your knowledge stays connected.</p>

      <form className="search-form" onSubmit={handleSubmit}>
        <span className="search-icon">
          <Search size={17} />
        </span>

        <input
          className="nl-search-input"
          type="text"
          placeholder="Search notes, subjects, or tags..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search notes"
        />

        {query && (
          <button type="button" className="nl-search-clear" aria-label="Clear search" onClick={() => setQuery("")}>
            <X size={16} />
          </button>
        )}

        <button type="submit" className="search-submit">
          Search
        </button>
      </form>

      {recentSearches.length > 0 && (
        <div className="recent-row">
          <span className="recent-label">Recent:</span>

          {recentSearches.map((term) => (
            <button key={term} className="recent-chip" onClick={() => setQuery(term)}>
              {term}
            </button>
          ))}

          <button className="recent-clear" onClick={() => setRecentSearches([])}>
            clear
          </button>
        </div>
      )}
    </header>
  )
}