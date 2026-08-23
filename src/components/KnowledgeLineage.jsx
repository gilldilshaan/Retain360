import React from "react"

// Builds the vertical chain: deepest prerequisite → … → selected → furthest use.
export function buildLineage(concept, lookup) {
  if (!concept) return []
  const up = []
  let cur = concept
  const seen = new Set([concept.id])
  while (up.length < 3) {
    const prereqId = (cur.prerequisites || []).find((id) => lookup[id] && !seen.has(id))
    if (!prereqId) break
    up.unshift(lookup[prereqId])
    seen.add(prereqId)
    cur = lookup[prereqId]
  }
  const down = []
  cur = concept
  while (down.length < 3) {
    const nextId = (cur.usedIn || []).find((id) => lookup[id] && !seen.has(id))
    if (!nextId) break
    down.push(lookup[nextId])
    seen.add(nextId)
    cur = lookup[nextId]
  }
  return [...up, concept, ...down]
}

export default function KnowledgeLineage({ concept, onSelectConcept, lookup }) {
  const chain = buildLineage(concept, lookup)
  if (chain.length < 2) return null

  const semestersSpanned = new Set(chain.map((c) => c.semester)).size

  return (
    <section className="inspector-section">
      <span className="micro section-label">Knowledge Lineage</span>
      <ol className="lineage">
        {chain.map((c, i) => (
          <li key={c.id} className="lineage-item">
            {i > 0 && (
              <span className="lineage-arrow" aria-hidden="true">
                ↓
              </span>
            )}
            <button
              type="button"
              className={`lineage-node${c.id === concept.id ? " current" : ""}`}
              onClick={() => c.id !== concept.id && onSelectConcept(c.id)}
              disabled={c.id === concept.id}
            >
              <span>{c.name}</span>
              <span className="lineage-sem">SEM {c.semester}</span>
            </button>
          </li>
        ))}
      </ol>
      <p className="lineage-caption">
        {chain.length} concepts connected across {semestersSpanned} semester
        {semestersSpanned > 1 ? "s" : ""}
      </p>
    </section>
  )
}