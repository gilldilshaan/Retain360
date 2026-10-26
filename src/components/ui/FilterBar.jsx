import React from "react"
import { Toggle } from "./Toggle.jsx"
import { semesters, subjects } from "../data/subjects.js"

export default function FilterBar({
  semester,
  setSemester,
  subject,
  setSubject,
  showPrerequisites,
  setShowPrerequisites,
  showRelated,
  setShowRelated,
}) {
  return (
    <div className="filter-bar">
      <select
        className="filter-semester"
        value={semester}
        onChange={(e) => setSemester(e.target.value)}
        aria-label="Filter by semester"
      >
        <option value="all">All Semesters</option>
        {semesters.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>

      <select
        className="filter-subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        aria-label="Filter by subject"
      >
        <option value="all">All Subjects</option>
        {subjects.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <Toggle
        checked={showPrerequisites}
        label="Prerequisites"
        onChange={setShowPrerequisites}
      />
      <Toggle
        checked={showRelated}
        label="Related Concepts"
        onChange={setShowRelated}
      />
    </div>
  )
}