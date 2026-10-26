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
    content: `Matrix multiplication (A × B)

Rule: A × B is only possible if the number of COLUMNS of A equals the number of ROWS of B.
A is (m × n) and B is (n × p)  →  result is (m × p).

Method (row by column):
Each cell (i, j) of the answer = row i of A  ·  column j of B
(multiply matching numbers, then add them up).

Example:
[1 2]   [5 6]   [1×5 + 2×7   1×6 + 2×8]   [19 22]
[3 4] × [7 8] = [3×5 + 4×7   3×6 + 4×8] = [43 50]

Remember:
- Order matters: A × B is usually NOT equal to B × A.
- It is associative: (AB)C = A(BC).
- Identity matrix I: A × I = A.
- Used in neural networks: one layer is y = W·x + b.`,
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
    content: `Eigenvalues and eigenvectors

Definition: for a square matrix A, if  A·v = λ·v  (v is not zero), then
v is an eigenvector and λ (lambda) is its eigenvalue.
Meaning: A only stretches or shrinks v, it does not turn it to a new direction.

How to find eigenvalues:
1. Write det(A − λI) = 0   (this is the characteristic polynomial)
2. Solve for λ.
3. For each λ, solve (A − λI)v = 0 to get the eigenvector.

Quick checks:
- Sum of eigenvalues = trace of A (sum of the diagonal).
- Product of eigenvalues = det(A).

Why it matters: stability of systems, and PCA uses the eigenvectors of the covariance matrix.`,
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
    content: `Vector spaces, span and basis

Span: all the vectors you can make by combining some vectors with numbers (linear combinations).

Linear independence: no vector in the set can be made from the others.
Test: c1·v1 + c2·v2 + ... = 0 only when every c is 0.

Basis: a set of vectors that is linearly independent AND spans the space.
Example: (1,0) and (0,1) are a basis of R².

Dimension: the number of vectors in a basis.
R² has dimension 2, R³ has dimension 3.

Remember: every vector in the space can be written in ONE unique way using a basis.`,
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
    content: `Probability distributions

Binomial: n tries, each is success/fail with probability p.
  Mean = n·p      Variance = n·p·(1 − p)

Poisson: number of events in a fixed time when events are rare and random.
  Mean = Variance = λ

Normal (bell curve): described by mean μ and standard deviation σ.
  68% of data within 1σ, 95% within 2σ, 99.7% within 3σ.

Which one to use?
- Counting successes in a fixed number of tries → Binomial
- Counting rare events in a time period → Poisson
- Measurements like height or marks → Normal

Poisson is an approximation of Binomial when n is large and p is small.`,
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
    content: `Neural network weights and backpropagation

Each neuron: output = activation(w·x + b)
w = weights, b = bias.

Forward pass: send the input through the layers to get a prediction.
Loss: measures how wrong the prediction is (for example, mean squared error).

Backpropagation:
1. Compute the loss.
2. Use the chain rule to find how much each weight contributed to the error (the gradient).
3. Move each weight a small step against its gradient:
   w = w − learning_rate × gradient
4. Repeat for many rounds (epochs).

Common problems:
- Vanishing gradients (gradients become almost 0 in deep networks)
- Overfitting (learns the training data too well)`,
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
    content: `Gradient descent

Goal: find the values of the parameters that make the loss as small as possible.

Update rule:  w = w − α × (slope of loss at w)
α (alpha) is the learning rate.

Learning rate:
- Too big → jumps over the minimum and may never settle.
- Too small → very slow.
- Good start: 0.01, then watch the loss curve.

Types:
- Batch: uses all data for every step (stable but slow)
- Stochastic (SGD): one example per step (fast but noisy)
- Mini-batch: small groups, the most common in practice

Tip: if the loss goes UP, the learning rate is probably too high.`,
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
    content: `PCA (Principal Component Analysis)

Purpose: reduce the number of features while keeping as much information (variance) as possible.

Steps:
1. Subtract the mean from each feature (centre the data).
2. Compute the covariance matrix.
3. Find its eigenvalues and eigenvectors.
4. Sort the eigenvectors by eigenvalue, largest first.
5. Keep the top k eigenvectors (principal components).
6. Project the data onto them.

Meaning: the first component points in the direction where the data varies the most.

Use: visualising data in 2D, speeding up models, removing noise.
Limit: it only finds straight-line patterns.`,
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
    content: `Newton's laws of motion

1st law (inertia): an object stays at rest or keeps moving in a straight line at constant speed unless a net force acts on it.

2nd law: F = m × a
Force (N) = mass (kg) × acceleration (m/s²)

3rd law: for every action there is an equal and opposite reaction.
(The two forces act on DIFFERENT objects.)

Examples:
- Passengers jerk forward when a bus brakes → 1st law.
- Pushing a heavier cart needs more force for the same acceleration → 2nd law.
- A rocket pushes gas down and the gas pushes the rocket up → 3rd law.`,
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
    content: `Electromagnetic field theory: key ideas

Electric field E: force per unit charge, E = F / q   (unit: N/C)
Coulomb's law: F = k·q1·q2 / r²

Maxwell's equations (in words):
1. Electric charges create electric fields (Gauss's law).
2. There are no magnetic monopoles (magnetic field lines are closed loops).
3. A changing magnetic field creates an electric field (Faraday's law).
4. Electric current and a changing electric field create a magnetic field (Ampere-Maxwell law).

Result: changing E and B fields can travel as waves, and light is one of them.
Speed of light c = 1 / √(μ0 · ε0)`,
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
    content: `Binary Search Tree (BST)

Rule: for every node, everything in the LEFT subtree is smaller and everything in the RIGHT subtree is bigger.

Operations:
- Search: compare, then go left or right.
- Insert: search for the place, then add a new leaf.
- Delete: 3 cases (leaf, one child, two children → replace with the inorder successor).

Traversals:
- Inorder (left, node, right) → gives sorted order
- Preorder (node, left, right)
- Postorder (left, right, node)

Time: O(log n) when balanced, but O(n) in the worst case (like a linked list).
That is why balanced trees (AVL, Red-Black) exist.`,
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
    content: `Graph traversal: BFS and DFS

BFS (Breadth-First Search)
- Uses a QUEUE.
- Visits level by level (all neighbours first).
- Finds the shortest path in an unweighted graph.

DFS (Depth-First Search)
- Uses a STACK (or recursion).
- Goes as deep as possible, then backtracks.
- Good for detecting cycles and topological sorting.

Both take O(V + E) time (V = vertices, E = edges).

Remember: keep a "visited" list, or you will loop forever in graphs with cycles.`,
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
    content: `TCP/IP model (4 layers)

1. Application: HTTP, FTP, DNS, SMTP (what the user's program uses)
2. Transport: TCP (reliable, ordered) and UDP (fast, no guarantee)
3. Internet: IP addressing and routing of packets
4. Network access (link): Ethernet, Wi-Fi, the physical sending

Encapsulation: going down, each layer adds its own header
data → segment → packet → frame

TCP vs UDP:
- TCP: 3-way handshake (SYN, SYN-ACK, ACK), retransmits lost data → web, email
- UDP: no connection → video calls, gaming, DNS

Routers work at the Internet layer and decide the next hop using the IP address.`,
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
    content: `Digital logic gates

AND: output 1 only if ALL inputs are 1
OR: output 1 if ANY input is 1
NOT: flips the input
NAND: NOT of AND (output 0 only when all inputs are 1)
NOR: NOT of OR
XOR: output 1 when the inputs are DIFFERENT

NAND and NOR are "universal" gates: any circuit can be built using only one of them.

De Morgan's laws:
- NOT(A · B) = NOT A + NOT B
- NOT(A + B) = NOT A · NOT B

Tip: to draw a truth table with n inputs, you need 2^n rows.`,
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
    content: `Laws of thermodynamics

Zeroth: if A is in thermal equilibrium with B, and B with C, then A is with C (this defines temperature).

First: energy cannot be created or destroyed.
  ΔU = Q − W   (change in internal energy = heat added − work done by the system)

Second: in an isolated system, entropy never decreases.
Heat flows from hot to cold by itself, not the other way.

Third: as temperature goes to absolute zero, entropy goes to a minimum value.

Entropy (S): a measure of disorder.
Carnot efficiency (best possible heat engine): η = 1 − Tc / Th  (temperatures in Kelvin)`,
    updated: "3 weeks ago",
  },
]

export const SUBJECTS = ["All", ...Array.from(new Set(NOTES.map((note) => note.subject)))]

// BTech has 8 semesters, so users can file notes in any of them
export const SEMESTERS = ["All", 1, 2, 3, 4, 5, 6, 7, 8]

// "NOTE" = a note the user wrote by hand (no uploaded file)
export const FILE_TYPES = ["All", ...Array.from(new Set([...NOTES.map((note) => note.type), "NOTE"]))]