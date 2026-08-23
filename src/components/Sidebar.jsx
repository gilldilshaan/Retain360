import React from "react"
import { MapIcon, OverviewIcon, MemoryIcon, NotesIcon, SubjectsIcon } from "./Icons.jsx"

const nav = [
  { id: "overview", label: "Overview", icon: OverviewIcon },
  { id: "map", label: "Knowledge Map", icon: MapIcon },
  { id: "memory", label: "Memory", icon: MemoryIcon },
  { id: "notes", label: "My Notes", icon: NotesIcon },
  { id: "subjects", label: "Subjects", icon: SubjectsIcon },
]

export default function Sidebar({ active = "map", onNavigate }) {
  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true">
          <MapIcon width={20} height={20} />
        </div>
        <div>
          <div className="brand-name">KINSHIP</div>
          <div className="brand-sub">ACADEMIC KNOWLEDGE WEB</div>
        </div>
      </div>

      <nav className="nav-list">
        {nav.map((item) => {
          const Icon = item.icon
          const isActive = item.id === active
          return (
            <button
              key={item.id}
              className={`nav-item${isActive ? " active" : ""}`}
              aria-current={isActive ? "page" : undefined}
              onClick={() => onNavigate?.(item.id)}
            >
              <Icon />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="footer-block">
          <span className="micro">Current Degree</span>
          <span className="footer-value">B.Tech CSE — AI &amp; ML</span>
        </div>
        <div className="footer-block">
          <span className="micro">Semester</span>
          <span className="footer-value">Semester 3</span>
        </div>
      </div>
    </aside>
  )
}