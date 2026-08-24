import React from "react"
import { Pin } from "lucide-react"

// Props passed down from NotesPage.jsx
export default function FilterBar({
  subjectFilter, setSubjectFilter,
  semesterFilter, setSemesterFilter,
  typeFilter, setTypeFilter,
  pinnedOnly, setPinnedOnly,
  pinnedIds, subjects, semesters, fileTypes,
  resultCount, totalCount,
}) {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <span className="filter-icon">☷</span>

        <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} aria-label="Filter by subject">
          {subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject === "All" ? "All subjects" : subject}
            </option>
          ))}
        </select>

        <select
          value={semesterFilter}
          onChange={(e) => setSemesterFilter(e.target.value === "All" ? "All" : Number(e.target.value))}
          aria-label="Filter by semester"
        >
          {semesters.map((semester) => (
            <option key={semester} value={semester}>
              {semester === "All" ? "All semesters" : `Semester ${semester}`}
            </option>
          ))}
        </select>

        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} aria-label="Filter by file type">
          {fileTypes.map((type) => (
            <option key={type} value={type}>
              {type === "All" ? "All file types" : type}
            </option>
          ))}
        </select>

        <button
          className={`pinned-toggle ${pinnedOnly ? "active" : ""}`}
          onClick={() => setPinnedOnly((value) => !value)}
        >
          <Pin size={13} /> Pinned ({pinnedIds.length})
        </button>
      </div>

      <div className="nl-results-count">
        {resultCount} of {totalCount} notes
      </div>
    </div>
  )
}