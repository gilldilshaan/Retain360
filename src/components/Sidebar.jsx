import React from "react"
import {
  MapIcon,
  OverviewIcon,
  MemoryIcon,
  NotesIcon,
  SubjectsIcon,
  SearchIcon,
  UserIcon,
} from "./Icons.jsx"
import { profile } from "../data/profile.js"

const primaryNav = [
  { id: "/dashboard", label: "Dashboard", icon: OverviewIcon },
  { id: "/knowledge", label: "Knowledge Web", icon: MapIcon },
  { id: "/memory", label: "Memory", icon: MemoryIcon },
  { id: "/search", label: "Search Notes", icon: SearchIcon },
]

const secondaryNav = [
  { id: "/notes", label: "My Notes", icon: NotesIcon },
  { id: "/subjects", label: "Subjects", icon: SubjectsIcon },
]

const profileNav = [{ id: "/profile", label: "Profile", icon: UserIcon }]

export default function Sidebar({ active, onNavigate }) {
  const renderItem = (item) => {
    const Icon = item.icon
    const isActive = active === item.id || (item.id !== "/" && active.startsWith(item.id))
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
  }

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

      <nav className="nav-list">{primaryNav.map(renderItem)}</nav>

      <nav className="nav-list" aria-label="Library navigation">
        <span className="micro nav-group-label">My Library</span>
        {secondaryNav.map(renderItem)}
      </nav>

      <nav className="nav-list nav-profile" aria-label="Account navigation">
        {profileNav.map(renderItem)}
      </nav>

      <div className="sidebar-footer">
        <div className="footer-block">
          <span className="micro">Current Degree</span>
          <span className="footer-value">{profile.degree}</span>
        </div>
        <div className="footer-block">
          <span className="micro">Semester</span>
          <span className="footer-value">Semester {profile.semester}</span>
        </div>
      </div>
    </aside>
  )
}
