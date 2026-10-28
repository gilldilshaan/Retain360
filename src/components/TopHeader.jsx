import React from "react"
import { SearchIcon, BellIcon, MoonIcon, SunIcon } from "./Icons.jsx"
import { usePreferences } from "../context/PreferencesContext"
import NotificationsPanel from "./dashboard/NotificationsPanel.jsx"
import ProfileMenu from "./dashboard/ProfileMenu.jsx"
import { profile } from "../data/profile.js"

export default function TopHeader({ meta, onOpenSearch, onToggleNav, notifications }) {
  const [notifOpen, setNotifOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, setThemePref } = usePreferences()
  const moonIcon = theme === "dark" ? MoonIcon : SunIcon
  const sunIcon = theme === "light" ? SunIcon : MoonIcon

  const toggleNotif = () => {
    setMenuOpen(false)
    setNotifOpen((o) => !o)
  }

  const toggleMenu = () => {
    setNotifOpen(false)
    setMenuOpen((o) => !o)
  }

  const toggleTheme = () => {
    setThemePref(theme === "light" ? "dark" : "light")
  }

  return (
    <header className="top-header">
      <div className="header-text">
        <button type="button" className="icon-btn burger" aria-label="Open navigation" onClick={onToggleNav}>
          <span className="burger-lines" aria-hidden="true" />
        </button>
        <div>
          <div className="micro">{meta.eyebrow}</div>
          <h1 className="header-title">
            <span className="serif">{meta.title}</span>
          </h1>
          <p className="header-sub">{meta.sub}</p>
        </div>
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

        <span className="pop-anchor">
          <button
            type="button"
            className={`icon-btn${notifOpen ? " active" : ""}`}
            aria-label="Notifications"
            aria-expanded={notifOpen}
            onClick={toggleNotif}
          >
            {notifications.some((n) => n.tone === "warn") && <span className="bell-dot" aria-hidden="true" />}
            <BellIcon />
          </button>
          <NotificationsPanel open={notifOpen} onClose={toggleNotif} notifications={notifications} />
        </span>

        <span className="pop-anchor">
          <button
            type="button"
            className={`avatar${menuOpen ? " active" : ""}`}
            aria-label="Account menu"
            aria-expanded={menuOpen}
            onClick={toggleMenu}
          >
            <span aria-hidden="true">{profile.initials}</span>
          </button>
          <ProfileMenu open={menuOpen} onClose={toggleMenu} />
        </span>

        <span className="pop-anchor">
          <button
            type="button"
            className={`icon-btn${notifOpen ? " active" : ""}`}
            aria-label="Toggle theme"
            onClick={toggleTheme}
          >
            {moonIcon} {sunIcon}
          </button>
        </span>
      </div>
    </header>
  )
}
