import { concepts, conceptsById } from "./concepts.js"

// Build the connection graph from the relationship data encoded on each concept.
// Edges are derived so the map stays accurate to the concept definitions and
// never connects things spuriously.
export function buildConnections() {
  const edges = []
  const seen = new Set()

  // One edge per unordered pair keeps the canvas clean — the first
  // relationship type to claim a pair wins.
  const pairKey = (a, b) => [a, b].sort().join("~")

  const addEdge = (sourceId, targetId, type) => {
    if (!conceptsById[sourceId] || !conceptsById[targetId]) return
    if (sourceId === targetId) return
    const key = pairKey(sourceId, targetId)
    if (seen.has(key)) return
    seen.add(key)
    edges.push({ source: sourceId, target: targetId, type })
  }

  // prerequisites first so they claim their pair before weaker types
  for (const concept of concepts)
    for (const prereq of concept.prerequisites) addEdge(prereq, concept.id, "prerequisite")

  for (const concept of concepts)
    for (const later of concept.usedIn) addEdge(concept.id, later, "used in")

  const related = [
    ["graphs", "graph-theory"],
    ["data-structures", "sql"],
    ["derivatives", "gradient-descent"],
    ["probability", "bayes"],
  ]
  for (const [a, b] of related) addEdge(a, b, "related")

  return edges
}

// The full edge set, computed once at module load.
export const connections = buildConnections()

export const connectionType = (type) =>
  ({ prerequisite: "Prerequisite", "used in": "Used in", related: "Related" }[type] || type)