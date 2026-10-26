import React, { useRef, useState } from "react"
import { SearchIcon } from "../Icons.jsx"

export default function SearchInput({ onInput, onClear, placeholder = "Search..." }) {
  const [query, setQuery] = useState("")
  const inputRef = useRef(null)

  const handleChange = (e) => {
    const value = e.target.value
    setQuery(value)
    onInput?.(value)
  }

  const handleClear = () => {
    setQuery("")
    onInput?.("")
    if (inputRef.current) inputRef.current.focus()
  }

  return (
    <div className="search-input-wrapper">
      <div className="search-input-field">
        <SearchIcon className="search-icon" width={18} height={18} />
        <input
          ref={inputRef}
          type="text"
          className="search-input-field-input"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          aria-label="Search"
        />
        {query.trim() && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <svg
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}