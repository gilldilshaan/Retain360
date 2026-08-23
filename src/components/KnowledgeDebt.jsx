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
      <p className="debt-text">
        Your retention of <strong>{debt.name}</strong> is {debt.retention}%. It is a prerequisite for{" "}
        <strong>{concept.name}</strong> — refreshing it will strengthen everything built on top.
      </p>
      <button type="button" className="btn btn-quiet" onClick={() => onRefresh(debt.id)}>
        Refresh · 2 min
      </button>
    </section>
  )
}