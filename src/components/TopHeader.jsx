import React from "react"
import { SearchIcon, BellIcon } from "./Icons.jsx"

export default function TopHeader({ onOpenSearch }) {
  return (
    <header className="top-header">
      <div className="header-text">
        <div className="micro">My Knowledge</div>
        <h1 className="header-title">
          <span className="serif">Knowledge Map</span>
        </h1>
        <p className="header-sub">See how everything you&rsquo;ve learned connects.</p>
      </div>

      <div className="header-actions">
        <button className="search-trigger" onClick={onOpenSearch} aria-label="Search concepts">
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