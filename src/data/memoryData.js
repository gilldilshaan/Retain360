// src/data/memoryData.js
// All mock data that powers the Memory Dashboard ("Knowledge Health") page.
// Swap these for real API / context data later — the shape is what matters.

export const overview = {
  knowledgeHealth: 69,
  strongestDomain: { name: "AI / ML", score: 83 },
  weakestDomain: { name: "Mathematics fundamentals", score: 62 },
  stats: [
    { label: "Topics Tracked", value: 8, icon: "book" },
    { label: "Need Revision", value: 3, icon: "alert" },
    { label: "Strong Topics", value: 3, icon: "shield" },
    { label: "Recently Revised", value: 2, icon: "clock" },
  ],
  domains: [
    { name: "Mathematics", score: 62 },
    { name: "Programming", score: 73 },
    { name: "DBMS", score: 64 },
    { name: "AI / ML", score: 83 },
  ],
};

// Little zig-zag point sets so each card gets its own believable sparkline.
const spark = (seed) => {
  const points = [];
  let v = 30 + (seed % 7) * 4;
  for (let i = 0; i < 10; i++) {
    v += Math.sin(i * (seed % 5 + 1)) * 8 + (i < 6 ? 2 : 5);
    points.push(Math.max(8, Math.min(92, Math.round(v))));
  }
  return points;
};

export const pulseTopics = [
  { id: "c-pointers", name: "C Pointers", category: "Programming", score: 42, trend: spark(3) },
  { id: "probability", name: "Probability", category: "Mathematics", score: 48, trend: spark(6) },
  { id: "normalization", name: "Normalization", category: "DBMS", score: 56, trend: spark(9), highlighted: true },
  { id: "python-basics", name: "Python Basics", category: "Programming", score: 91, trend: spark(2) },
  { id: "java-oop", name: "Java OOP", category: "Programming", score: 87, trend: spark(4) },
  { id: "neural-networks", name: "Neural Networks", category: "AI / ML", score: 83, trend: spark(7) },
  { id: "matrix-ops", name: "Matrix Operations", category: "Mathematics", score: 76, trend: spark(5) },
  { id: "sql-joins", name: "SQL Joins", category: "DBMS", score: 79, trend: spark(8) },
];

// Knowledge graph — x / y are percentages of the canvas, so nodes and the
// SVG edge overlay always stay in sync at any viewport size.
export const knowledgeNodes = [
  { id: "c-pointers", label: "C Pointers", score: 42, x: 10, y: 18 },
  { id: "memory-mgmt", label: "Memory Mgmt.", score: 52, x: 6, y: 52 },
  { id: "data-structures", label: "Data Structures", score: 71, x: 30, y: 24 },
  { id: "operating-systems", label: "Operating Systems", score: 64, x: 27, y: 58 },
  { id: "algorithms", label: "Algorithms", score: 76, x: 50, y: 20 },
  { id: "dbms-concepts", label: "DBMS Concepts", score: 64, x: 47, y: 62 },
  { id: "python", label: "Python", score: 91, x: 68, y: 10 },
  { id: "machine-learning", label: "Machine Learning", score: 81, x: 68, y: 40 },
  { id: "neural-networks", label: "Neural Networks", score: 83, x: 66, y: 68 },
  { id: "statistics", label: "Statistics", score: 62, x: 90, y: 30 },
  { id: "probability", label: "Probability", score: 48, x: 92, y: 8 },
  { id: "deep-learning", label: "Deep Learning", score: 78, x: 90, y: 60 },
];

export const knowledgeEdges = [
  ["c-pointers", "memory-mgmt"],
  ["c-pointers", "data-structures"],
  ["memory-mgmt", "operating-systems"],
  ["operating-systems", "data-structures"],
  ["data-structures", "algorithms"],
  ["operating-systems", "dbms-concepts"],
  ["algorithms", "dbms-concepts"],
  ["algorithms", "python"],
  ["python", "machine-learning"],
  ["dbms-concepts", "neural-networks"],
  ["machine-learning", "neural-networks"],
  ["machine-learning", "statistics"],
  ["statistics", "probability"],
  ["machine-learning", "deep-learning"],
  ["statistics", "deep-learning"],
];

export const strongKnowledge = [
  { id: "python-functions", name: "Python Functions", category: "Programming", score: 91, lastRevised: "2 days ago", trend: spark(1), pinned: true },
  { id: "neural-networks-strong", name: "Neural Networks", category: "AI / ML", score: 83, lastRevised: "6 days ago", trend: spark(7) },
  { id: "sql-joins-strong", name: "SQL Joins", category: "DBMS", score: 79, lastRevised: "10 days ago", trend: spark(8) },
  { id: "matrix-ops-strong", name: "Matrix Operations", category: "Mathematics", score: 76, lastRevised: "8 days ago", trend: spark(5) },
];

export const memoryJourney = [
  { id: "j1", topic: "C Pointers", note: "Reviewed pointer arithmetic", when: "Today, 10:42 AM", from: 42, to: 91 },
  { id: "j2", topic: "Probability", note: "Reviewed conditional probability", when: "2 days ago", from: 48, to: 76 },
  { id: "j3", topic: "Python Functions", note: "Practiced callbacks and closures", when: "5 days ago", from: 78, to: 91 },
];

export const smartInsight = {
  strongest: "AI / ML",
  limiting: "Mathematics",
  message:
    "You're strongest in AI / ML, but Mathematics is currently limiting your overall knowledge health.",
  action: {
    title: "Revise Probability",
    impact: "+8% knowledge health",
  },
};

export const fadingTopics = [
  {
    id: "c-pointers",
    rank: 1,
    name: "C Pointers",
    category: "Programming",
    score: 42,
    drop: 12,
    lastRevised: "32 days ago",
    urgency: "Very High",
    notesPlaceholder: "Reviewed pointer arithmetic, arrays and pointers to pointers.",
  },
  {
    id: "probability",
    rank: 2,
    name: "Probability",
    category: "Mathematics",
    score: 48,
    drop: 8,
    lastRevised: "25 days ago",
    urgency: "High",
    notesPlaceholder: "Reviewed conditional probability and Bayes' theorem.",
  },
  {
    id: "normalization",
    rank: 3,
    name: "Normalization",
    category: "DBMS",
    score: 56,
    drop: 5,
    lastRevised: "18 days ago",
    urgency: "Medium",
    notesPlaceholder: "Reviewed 1NF, 2NF and 3NF with examples.",
  },
  {
    id: "react-router",
    rank: 4,
    name: "React Router",
    category: "React",
    score: 58,
    drop: 6,
    lastRevised: "16 days ago",
    urgency: "Medium",
    notesPlaceholder: "Practice nested routes, dynamic routes and route params.",
  },
  {
    id: "async-await",
    rank: 5,
    name: "Promises & async/await",
    category: "JavaScript",
    score: 54,
    drop: 7,
    lastRevised: "14 days ago",
    urgency: "Medium",
    notesPlaceholder: "Practice fetch API, Promises and async/await.",
  },
  {
    id: "controlled-components",
    rank: 6,
    name: "Controlled Components",
    category: "React",
    score: 61,
    drop: 4,
    lastRevised: "12 days ago",
    urgency: "Medium",
    notesPlaceholder: "Revise forms, state and controlled inputs in React.",
  },
];

export const curriculum = [
  {
    weeks: "7–12",
    title: "HTML, CSS & JavaScript Foundations",
    color: "yellow",
    topics: [
      "HTML structure",
      "Semantic tags",
      "Accessibility basics",
      "CSS fundamentals",
      "Box Model",
      "Flexbox",
      "CSS Grid",
      "Responsive design",
      "Media queries",
      "Mobile-first layouts",
      "JavaScript variables",
      "Functions",
      "Arrays",
      "Objects",
      "Loops",
      "Browser DevTools",
      "VS Code setup",
      "Git & GitHub basics",
      "Mini project: responsive landing page",
    ],
  },
  {
    weeks: "13–18",
    title: "Modern JavaScript",
    color: "green",
    topics: [
      "let / const",
      "Arrow functions",
      "Destructuring",
      "Spread & rest",
      "ES modules",
      "Imports & exports",
      "Promises",
      "async / await",
      "fetch API",
      "DOM manipulation",
      "Event handling",
      "Browser storage",
      "JSON",
      "Forms",
      "Mini project: interactive to-do app",
    ],
  },
  {
    weeks: "19–24",
    title: "React Setup & Interactivity",
    color: "rust",
    topics: [
      "Handling events",
      "Forms in React",
      "Controlled components",
      "React project setup with Vite / CRA",
      "Mini project: counter app",
      "Mini project: product card UI",
    ],
  },
  {
    weeks: "25–30",
    title: "React Core Concepts",
    color: "olive",
    topics: [
      "React introduction",
      "Component-based architecture",
      "JSX",
      "Components",
      "Props",
      "State",
      "Rendering lists",
      "Conditional rendering",
    ],
  },
  {
    weeks: "31–36",
    title: "React Hooks & Reusable UI",
    color: "green",
    topics: [
      "useState",
      "useEffect",
      "useRef",
      "useMemo",
      "useCallback",
      "Component composition",
      "Reusable UI",
      "Custom hooks",
      "Lifting state up",
      "Prop drilling basics",
      "Mini project: weather app",
      "Mini project: notes app",
    ],
  },
  {
    weeks: "37–42",
    title: "React Router",
    color: "yellow",
    topics: [
      "React Router basics",
      "Nested routes",
      "Dynamic routes",
      "Route params",
      "Protected routes",
      "404 pages",
    ],
  },
];

export const recallLevels = [
  { id: "struggled", label: "Struggled", range: "0 – 45%", min: 0, max: 45 },
  { id: "partial", label: "Partial", range: "45 – 65%", min: 45, max: 65 },
  { id: "confident", label: "Confident", range: "65 – 85%", min: 65, max: 85 },
  { id: "mastered", label: "Mastered", range: "85 – 100%", min: 85, max: 100 },
];

