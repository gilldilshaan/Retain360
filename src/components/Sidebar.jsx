import { useState } from "react";

export default function Sidebar({ activeNav = "Memory Center", onSelectNav }) {
  const [currentNav, setCurrentNav] = useState(activeNav);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    {
      id: "memory",
      label: "Memory Center",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      id: "goals",
      label: "Goals",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
    },
    {
      id: "notebook",
      label: "Notebook",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
    },
    {
      id: "ai",
      label: "AI Assistant",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      ),
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18" />
          <path d="m19 9-5 5-4-4-3 3" />
        </svg>
      ),
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
  ];

  const handleNavClick = (label) => {
    setCurrentNav(label);
    setIsMobileOpen(false);
    if (onSelectNav) onSelectNav(label);
  };

  return (
    <>
      <div className="mobile-top-bar-toggle">
        <div className="mobile-brand-title">
          <span className="brand-dot" />
          <span>Retain360</span>
        </div>
        <button
          type="button"
          className="mobile-hamburger-btn"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMobileOpen ? "✕" : "☰"}
        </button>
      </div>

      <aside className={`retain360-sidebar ${isMobileOpen ? "mobile-drawer-open" : ""}`}>
        <div className="sidebar-brand-header">
          <div className="sidebar-brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04" />
              <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04" />
            </svg>
          </div>
          <div className="sidebar-brand-text">
            <span className="brand-name-title">Retain360</span>
            <span className="brand-sub-title">Memory Center</span>
          </div>
        </div>

        <nav className="sidebar-nav-menu">
          {navItems.map((item) => {
            const isActive = currentNav === item.label;
            return (
              <button
                key={item.id}
                type="button"
                className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                onClick={() => handleNavClick(item.label)}
              >
                <span className="nav-item-icon">{item.icon}</span>
                <span className="nav-item-label">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-quote-box">
          <p className="sidebar-quote-text">
            "The beautiful thing about learning is that no one can take it away from you."
          </p>
          <span className="sidebar-quote-author">— B.B. King</span>
        </div>

        <div className="sidebar-user-footer">
          <div className="user-avatar-circle">
            <span className="user-avatar-initials">SK</span>
          </div>
          <div className="user-info-text">
            <span className="user-display-name">Samreet Kaur</span>
            <span className="user-role-label">Student</span>
          </div>
          <div className="user-menu-chevron">⌄</div>
        </div>
      </aside>
    </>
  );
}
