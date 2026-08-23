import React from "react"

// Finds the weakest prerequisite below the retention threshold, if any.
export function findDebt(concept, lookup) {
  if (!concept) return null
  const weak = (concept.prerequisites || [])
    .map((id) => lookup[id])
    .filter((c) => c && c.retention < 50)
    .sort((a, b) => a.retention - b.retention)
  return weak[0] || null
}

export default function KnowledgeDebt({ concept, onRefresh, lookup }) {
  const debt = findDebt(concept, lookup)
  if (!debt) return null

  return (
    <section className="inspector-section debt">
      <span className="micro section-label">Knowledge Debt</span>
      <p className="debt-title">
        {debt.name} <span className="debt-pct">{debt.retention}% retention</span>
      </p>
      <p className="debt-text">This prerequisite may need a quick refresh.</p>
      <button type="button" className="btn btn-quiet" onClick={() => onRefresh(debt.id)}>
        Quick Refresh
      </button>
    </section>
  )
}