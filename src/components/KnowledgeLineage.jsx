import React from "react"

// Builds the vertical chain: deepest prerequisites → selected → furthest uses.
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

// The signature KINSHIP element: shows concepts learned years apart as one
// chain, grouped under their semester labels.
export default function KnowledgeLineage({ concept, onSelectConcept, lookup }) {
  const chain = buildLineage(concept, lookup)
  if (chain.length < 2) return null

  const semestersSpanned = new Set(chain.map((c) => c.semester)).size

  return (
    <section className="inspector-section">
      <span className="micro section-label">Knowledge Lineage</span>

      <ol className="lineage">
        {chain.map((c, i) => {
          const newSemester = i === 0 || chain[i - 1].semester !== c.semester
          return (
            <li key={c.id} className="lineage-item">
              {newSemester && <span className="lineage-sem-label">SEM {c.semester}</span>}
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
                <span className="lineage-subject">{lookup[c.id] && subjectShort(c.subject)}</span>
              </button>
            </li>
          )
        })}
      </ol>

      <p className="lineage-caption">
        {chain.length} concepts connected across {semestersSpanned} semester
        {semestersSpanned > 1 ? "s" : ""}
      </p>
    </section>
  )
}

function subjectShort(subjectId) {
  const names = {
    mathematics: "MATH",
    programming: "PROG",
    dsa: "DSA",
    discrete: "DM",
    dbms: "DBMS",
    os: "OS",
    ai: "AI",
    advanced: "ADV",
  }
  return names[subjectId] || ""
}