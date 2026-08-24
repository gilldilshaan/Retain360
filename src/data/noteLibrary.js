// Notes library data — adapted from the teammate's Notes project.
// Kept separate from notes.js (concept-linked quick notes used by the
// inspector) so either data source can later be swapped for an API.

export const NOTES = [
  {
    id: 1,
    title: "Matrix Multiplication",
    subject: "Mathematics",
    semester: 1,
    type: "PDF",
    tags: ["linear algebra", "matrices"],
    preview:
      "Row-by-column method for multiplying matrices, dimension compatibility rules, and worked examples using 2x2 and 3x3 systems.",
    related: [
      "Matrices & Eigenvalues",
      "Neural Network Weights & Backprop",
      "Vector Spaces & Basis",
    ],
    updated: "3 days ago",
  },
  {
    id: 2,
    title: "Matrices & Eigenvalues",
    subject: "Mathematics",
    semester: 2,
    type: "PPT",
    tags: ["linear algebra", "eigenvalues", "eigenvectors"],
    preview:
      "Characteristic polynomials, eigenvalue decomposition, and why eigenvectors matter for stability and transformation analysis.",
    related: ["Matrix Multiplication", "PCA — Dimensionality Reduction"],
    updated: "1 week ago",
  },
  {
    id: 3,
    title: "Vector Spaces & Basis",
    subject: "Mathematics",
    semester: 1,
    type: "PDF",
    tags: ["linear algebra", "vector spaces"],
    preview:
      "Definitions of span, basis, and dimension, with proofs of linear independence for common vector space examples.",
    related: ["Matrix Multiplication", "Gradient Descent Optimization"],
    updated: "2 weeks ago",
  },
  {
    id: 4,
    title: "Probability Distributions",
    subject: "Mathematics",
    semester: 3,
    type: "PDF",
    tags: ["probability", "statistics"],
    preview:
      "Binomial, Poisson, and normal distributions compared, with derivations of mean and variance for each.",
    related: ["Gradient Descent Optimization"],
    updated: "1 month ago",
  },
  {
    id: 5,
    title: "Neural Network Weights & Backprop",
    subject: "Machine Learning",
    semester: 6,
    type: "PPT",
    tags: ["neural networks", "backpropagation"],
    preview:
      "How weight matrices propagate signals forward and how gradients flow backward using chain-rule matrix calculus.",
    related: ["Matrix Multiplication", "Gradient Descent Optimization"],
    updated: "2 days ago",
  },
  {
    id: 6,
    title: "Gradient Descent Optimization",
    subject: "Machine Learning",
    semester: 6,
    type: "PDF",
    tags: ["optimization", "calculus"],
    preview:
      "Batch, stochastic, and mini-batch gradient descent, learning rate tuning, and convergence behaviour on loss surfaces.",
    related: ["Neural Network Weights & Backprop", "Vector Spaces & Basis"],
    updated: "2 days ago",
  },
  {
    id: 7,
    title: "PCA — Dimensionality Reduction",
    subject: "Machine Learning",
    semester: 7,
    type: "PPT",
    tags: ["PCA", "eigenvalues"],
    preview:
      "Using eigenvectors of the covariance matrix to project high-dimensional data onto fewer, more informative axes.",
    related: ["Matrices & Eigenvalues"],
    updated: "5 days ago",
  },
  {
    id: 8,
    title: "Newton's Laws of Motion",
    subject: "Physics",
    semester: 1,
    type: "PDF",
    tags: ["mechanics", "forces"],
    preview:
      "The three laws stated formally, with free-body diagrams for common engineering statics problems.",
    related: ["Entropy & Laws of Thermodynamics"],
    updated: "3 weeks ago",
  },
  {
    id: 9,
    title: "Electromagnetic Field Theory",
    subject: "Physics",
    semester: 3,
    type: "DOCX",
    tags: ["EM fields", "Maxwell's equations"],
    preview:
      "Maxwell's four equations in integral and differential form, and their physical interpretation in circuit contexts.",
    related: ["Digital Logic Gates"],
    updated: "1 month ago",
  },
  {
    id: 10,
    title: "Binary Search Trees",
    subject: "Data Structures",
    semester: 3,
    type: "PDF",
    tags: ["trees", "search"],
    preview:
      "Insertion, deletion, and traversal operations on BSTs, with worst-case analysis and balancing motivation.",
    related: ["Graph Traversal Algorithms"],
    updated: "4 days ago",
  },
  {
    id: 11,
    title: "Graph Traversal Algorithms",
    subject: "Algorithms",
    semester: 4,
    type: "PPT",
    tags: ["graphs", "BFS", "DFS"],
    preview:
      "Breadth-first and depth-first search compared, with complexity analysis and use cases in dependency resolution.",
    related: ["Binary Search Trees", "TCP/IP Protocol Stack"],
    updated: "6 days ago",
  },
  {
    id: 12,
    title: "TCP/IP Protocol Stack",
    subject: "Computer Networks",
    semester: 5,
    type: "PDF",
    tags: ["networking", "protocols"],
    preview:
      "The four-layer TCP/IP model, packet encapsulation, and how routing decisions are made at each layer.",
    related: ["Graph Traversal Algorithms"],
    updated: "1 week ago",
  },
  {
    id: 13,
    title: "Digital Logic Gates",
    subject: "Electronics",
    semester: 2,
    type: "IMG",
    tags: ["logic gates", "boolean algebra"],
    preview:
      "Truth tables and symbols for AND, OR, NOT, NAND, NOR, and XOR gates, with De Morgan's law applications.",
    related: ["Electromagnetic Field Theory"],
    updated: "2 weeks ago",
  },
  {
    id: 14,
    title: "Entropy & Laws of Thermodynamics",
    subject: "Thermodynamics",
    semester: 4,
    type: "DOCX",
    tags: ["entropy", "heat engines"],
    preview:
      "Zeroth through third laws, entropy as a measure of disorder, and Carnot efficiency for ideal heat engines.",
    related: ["Newton's Laws of Motion"],
    updated: "3 weeks ago",
  },
]

export const SUBJECT_COLORS = {}

export const SUBJECTS = ["All", ...Array.from(new Set(NOTES.map((note) => note.subject)))]

export const SEMESTERS = [
  "All",
  ...Array.from(new Set(NOTES.map((note) => note.semester))).sort((a, b) => a - b),
]

export const FILE_TYPES = ["All", ...Array.from(new Set(NOTES.map((note) => note.type)))]