import React from "react"
import { SearchIcon, BellIcon } from "./Icons.jsx"

// Header text comes from PAGE_META in App — it changes with the route.
export default function TopHeader({ meta, onOpenSearch }) {
  return (
    <header className="top-header">
      <div className="header-text">
        <div className="micro">{meta.eyebrow}</div>
        <h1 className="header-title">
          <span className="serif">{meta.title}</span>
        </h1>
        <p className="header-sub">{meta.sub}</p>
      </div>

      <div className="header-actions">
        <button
          className="search-trigger"
          onClick={onOpenSearch}
          aria-label="Search concepts"
          style={{ display: onOpenSearch ? undefined : "none" }}
        >
          <SearchIcon />
          <kbd>⌘ K</kbd>
        </button>
        <button className="icon-btn" aria-label="Notifications">
          <BellIcon />
        </button>
        <button className="avatar" aria-label="Account">
          <span aria-hidden="true">AD</span>
        </button>
      </div>
    </header>
  )
}