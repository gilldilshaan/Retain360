import { useState } from "react";

export default function TopNav({ activeTab = "Memory Center", onSelectTab }) {
  const [currentTab, setCurrentTab] = useState(activeTab);

  const navLinks = ["Memory Center", "Notes", "Goals", "Analytics"];

  const handleTabClick = (tab) => {
    setCurrentTab(tab);
    if (onSelectTab) onSelectTab(tab);
  };

  return (
    <header className="retain-top-nav">
      <div className="top-nav-inner">
        <div className="top-nav-left">
          <span className="brand-logo-type">RETAIN360</span>
        </div>

        <nav className="top-nav-links">
          {navLinks.map((tab) => {
            const isActive = currentTab === tab;
            return (
              <button
                key={tab}
                type="button"
                className={`top-nav-link-btn ${isActive ? "active-link" : ""}`}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </button>
            );
          })}
        </nav>

        <div className="top-nav-right">
          <div className="user-profile-badge">
            <span className="profile-initials">SK</span>
            <span className="profile-name">Samreet Kaur</span>
          </div>
        </div>
      </div>
    </header>
  );
}
