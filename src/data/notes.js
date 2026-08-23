import { conceptsById } from "./concepts.js"

export const notes = [
  {
    id: "note-1",
    conceptId: "matrix-multiplication",
    title: "Row × Column intuition",
    body: "Each cell (i, j) of AB is the dot product of row i of A and column j of B. Draw it once and it never leaves you.",
    created: "Sep 14",
  },
  {
    id: "note-2",
    conceptId: "matrix-multiplication",
    title: "Why order matters",
    body: "AB ≠ BA in general. A model weights are applied right-to-left; keep the input shape straight.",
    created: "Sep 16",
  },
  {
    id: "note-3",
    conceptId: "matrix-multiplication",
    title: "Link to neural nets",
    body: "A layer is y = Wx + b. The forward pass is just one long matrix multiplication.",
    created: "Oct 02",
  },
  {
    id: "note-4",
    conceptId: "functions",
    title: "Pure vs effectful",
    body: "A pure function maps input to output with no side effects — the mathematical view.",
    created: "Aug 30",
  },
  {
    id: "note-5",
    conceptId: "derivatives",
    title: "Slope at a point",
    body: "f'(x) is the slope of the tangent. Gradient descent is just descending that slope.",
    created: "Sep 05",
  },
  {
    id: "note-6",
    conceptId: "gradient-descent",
    title: "Learning rate feel",
    body: "Too big overshoots; too small crawls. Start with 0.01 and watch the loss curve.",
    created: "Oct 10",
  },
  {
    id: "note-7",
    conceptId: "neural-networks",
    title: "Forward vs backward",
    body: "Forward pass computes predictions; backward pass (backprop) moves the error into every weight.",
    created: "Oct 22",
  },
  {
    id: "note-8",
    conceptId: "probability",
    title: "Conditional intuition",
    body: "P(A|B) shrinks the sample space to B. Bayes' theorem is just that, flipped.",
    created: "Sep 09",
  },
  {
    id: "note-9",
    conceptId: "trees",
    title: "Tree traversal",
    body: "Preorder, inorder, postorder — the trick is where the visit step sits relative to recursion.",
    created: "Nov 01",
  },
]

export const notesFor = (conceptId) => notes.filter((n) => n.conceptId === conceptId)
export const countNotes = (conceptId) => notesFor(conceptId).length

export const noteCounts = Object.fromEntries(
  conceptsById ? Object.keys(conceptsById).map((id) => [id, countNotes(id)]) : []
)