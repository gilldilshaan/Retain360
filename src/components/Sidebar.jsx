import React from "react"
import { MapIcon, OverviewIcon, MemoryIcon, NotesIcon, SubjectsIcon } from "./Icons.jsx"

// One entry per route. `active` is the current pathname so the highlight
// always matches the URL.
const nav = [
  { id: "/", label: "Overview", icon: OverviewIcon },
  { id: "/map", label: "Knowledge Map", icon: MapIcon },
  { id: "/health", label: "Knowledge Health", icon: MemoryIcon },
  { id: "/notes", label: "My Notes", icon: NotesIcon },
  { id: "/subjects", label: "Subjects", icon: SubjectsIcon },
]

export default function Sidebar({ active, onNavigate }) {
  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <button type="button" className="brand" onClick={() => onNavigate("/")}>
        <span className="brand-mark" aria-hidden="true">
          <MapIcon width={20} height={20} />
        </span>
        <span className="brand-text">
          <span className="brand-name">KINSHIP</span>
          <span className="brand-sub">ACADEMIC KNOWLEDGE WEB</span>
        </span>
      </button>

      <nav className="nav-list">
        {nav.map((item) => {
          const Icon = item.icon
          const isActive = item.id === active
          return (
            <button
              key={item.id}
              className={`nav-item${isActive ? " active" : ""}`}
              aria-current={isActive ? "page" : undefined}
              onClick={() => onNavigate(item.id)}
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