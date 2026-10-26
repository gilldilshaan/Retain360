import React, { useState } from "react"

export default function SortControl({
  sortBy,
  setSortBy,
  direction,
  setDirection,
  label = "Sort by",
}) {
  const directionLabels = { asc: "Ascending", desc: "Descending" }

  return (
    <div className="sort-control">
      <select
        className="sort-select"
        value={sortBy || "relevance"}
        onChange={(e) => setSortBy(e.target.value)}
        aria-label={label}
      >
        <option value="relevance">Relevance</option>
        <option value="name">Name A-Z</option>
        <option value="name-reverse">Name Z-A</option>
        <option value="retention">Retention</option>
      </select>

      {sortBy && (
        <select
          className="sort-direction"
          value={direction || "asc"}
          onChange={(e) => setDirection(e.target.value)}
          aria-label="Sort direction"
        >
          <option value="asc">#{directionLabels.asc}</option>
          <option value="desc">#{directionLabels.desc}</option>
        </select>
      )}
    </div>
  )
}