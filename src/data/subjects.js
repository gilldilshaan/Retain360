export const subjects = [
  { id: "mathematics", name: "Mathematics" },
  { id: "programming", name: "Programming" },
  { id: "dsa", name: "Data Structures" },
  { id: "discrete", name: "Discrete Mathematics" },
  { id: "dbms", name: "Database Systems" },
  { id: "os", name: "Operating Systems" },
  { id: "ai", name: "Artificial Intelligence" },
  { id: "advanced", name: "Advanced Topics" },
]

export const semesters = [
  { id: 1, label: "SEM 1", name: "Foundations" },
  { id: 2, label: "SEM 2", name: "Core Computing" },
  { id: 3, label: "SEM 3", name: "Systems + AI" },
  { id: 4, label: "SEM 4", name: "Advanced" },
]

export const subjectOf = (id) => subjects.find((s) => s.id === id)?.name || "—"