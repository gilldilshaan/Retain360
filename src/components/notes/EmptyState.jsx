import React from "react"

export default function EmptyState({ query }) {
  return (
    <div className="nl-empty">
      <h3>{query ? `No notes found for "${query}"` : "No notes found"}</h3>
      <p className="empty-sub">Try a different search, subject, or semester.</p>
    </div>
  )
}