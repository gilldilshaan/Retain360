// World-space coordinates for every concept. The graph is laid out by hand so
// that foundations sit on the left and advanced concepts on the right, with
// each semester occupying a quiet vertical band. This keeps the map readable
// and intentionally non-random — it is an atlas, not a cloud.
export const positions = {
  // SEMESTER 1 · mathematics (left band)
  functions: { x: 130, y: 120 },
  limits: { x: 130, y: 260 },
  derivatives: { x: 130, y: 400 },
  matrices: { x: 130, y: 540 },
  "matrix-multiplication": { x: 130, y: 680 },
  "linear-algebra": { x: 130, y: 800 },
  probability: { x: 280, y: 180 },

  // SEMESTER 1 · programming
  variables: { x: 280, y: 60 },
  pointers: { x: 280, y: 420 },
  programming: { x: 280, y: 620 },

  // SEMESTER 2 · discrete + structures
  sets: { x: 430, y: 120 },
  relations: { x: 430, y: 280 },
  recursion: { x: 430, y: 460 },
  "data-structures": { x: 580, y: 120 },
  arrays: { x: 580, y: 300 },
  "linked-lists": { x: 580, y: 480 },
  trees: { x: 580, y: 640 },
  graphs: { x: 580, y: 800 },
  "graph-theory": { x: 430, y: 640 },
  "graph-algorithms": { x: 430, y: 800 },

  // SEMESTER 3 · systems
  processes: { x: 730, y: 120 },
  threads: { x: 730, y: 300 },
  "memory-management": { x: 730, y: 480 },
  sql: { x: 730, y: 640 },
  normalization: { x: 730, y: 800 },
  transactions: { x: 880, y: 220 },

  // SEMESTER 3 · AI
  bayes: { x: 880, y: 380 },
  "machine-learning": { x: 880, y: 560 },
  "linear-regression": { x: 880, y: 740 },
  "gradient-descent": { x: 880, y: 900 },
  "neural-networks": { x: 1060, y: 420 },

  // SEMESTER 4 · advanced
  "deep-learning": { x: 1240, y: 200 },
  cnn: { x: 1240, y: 420 },
  nlp: { x: 1240, y: 640 },
  "computer-vision": { x: 1240, y: 860 },
  transformers: { x: 1240, y: 1000 },
}

export const positionFor = (id) => positions[id] || { x: 0, y: 0 }