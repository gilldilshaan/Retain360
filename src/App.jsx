import React, { useState, useEffect, useCallback } from "react"
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom"

import Sidebar from "./components/Sidebar.jsx"
import TopHeader from "./components/TopHeader.jsx"
import KnowledgeMapPage from "./components/KnowledgeMapPage.jsx"
import Dashboard from "./components/Dashboard.jsx"
import NotesPage from "./components/NotesPage.jsx"
import KnowledgeHealth from "./components/KnowledgeHealth.jsx"
import SubjectsPage from "./components/SubjectsPage.jsx"
import RefreshModal from "./components/RefreshModal.jsx"
import LandingPage from "./components/LandingPage.jsx"
import SearchPage from "./components/SearchPage.jsx"
import ProfilePage from "./components/ProfilePage.jsx"

import { conceptsById } from "./data/concepts.js"
import { AppProvider, useApp } from "./context/AppContext.jsx"

const PAGE_META = {
  "/dashboard": { eyebrow: "My Knowledge", title: "Dashboard", sub: "Your whole degree, one connected system." },
  "/knowledge": { eyebrow: "My Knowledge", title: "Knowledge Web", sub: "See how everything you've learned connects." },
  "/memory": { eyebrow: "My Knowledge", title: "Memory", sub: "What you remember — and what's fading." },
  "/notes": { eyebrow: "My Library", title: "My Notes", sub: "Everything you've written, searchable." },
  "/subjects": { eyebrow: "My Knowledge", title: "Subjects", sub: "Courses across all four years." },
  "/search": { eyebrow: "My Library", title: "Search & Notes", sub: "Find any concept or note across your degree." },
  "/profile": { eyebrow: "Account", title: "Profile", sub: "Your academic snapshot at a glance." },
}

function AppContent() {
  const {
    conceptsLive,
    conceptsLiveById,
    selectedId,
    setSelectedId,
    viewRef,
    refreshId,
    setRefreshId,
    handleReviewed,
    retentionOverrides,
    toast,
    notifications,
  } = useApp()

  // ── Graph visualization filter state local to knowledge map ──
  const [hoveredId, setHoveredId] = useState(null)
  const [semesterFilter, setSemesterFilter] = useState("all")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [showPrerequisites, setShowPrerequisites] = useState(true)
  const [showRelated, setShowRelated] = useState(true)

  // ── In-map search overlay and mobile navigation state ──
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()
  const pageMeta = PAGE_META[location.pathname] || PAGE_META["/dashboard"]

  const handleOpenSearch = useCallback(() => {
    if (location.pathname === "/knowledge") {
      setSearchOpen((o) => !o)
    } else if (location.pathname === "/search") {
      const searchInput = document.querySelector(".notes-search")
      if (searchInput) {
        searchInput.focus()
        searchInput.select?.()
      }
    } else {
      navigate("/search")
    }
  }, [location.pathname, navigate])

  // Global ⌘K / Ctrl+K keyboard shortcut:
  // On knowledge map, toggles in-map search overlay.
  // On search page, focuses and selects search input.
  // Anywhere else, navigates to the dedicated /search page.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        handleOpenSearch()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [handleOpenSearch])

  useEffect(() => {
    setMobileNavOpen(false)
  }, [location.pathname])

  // The landing page renders standalone, outside the app frame.
  if (location.pathname === "/") {
    return <LandingPage />
  }

  return (
    <div className={`app${mobileNavOpen ? " nav-open" : ""}`}>
      {mobileNavOpen && <div className="sidebar-backdrop" onClick={() => setMobileNavOpen(false)} />}

      <Sidebar
        active={location.pathname}
        onNavigate={(path) => {
          navigate(path)
          setMobileNavOpen(false)
        }}
      />

      <main className="main">
        <TopHeader
          meta={pageMeta}
          onOpenSearch={handleOpenSearch}
          onToggleNav={() => setMobileNavOpen((o) => !o)}
          notifications={notifications}
        />

        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/knowledge"
            element={
              <KnowledgeMapPage
                conceptsLive={conceptsLive}
                conceptsLiveById={conceptsLiveById}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                hoveredId={hoveredId}
                setHoveredId={setHoveredId}
                semesterFilter={semesterFilter}
                setSemesterFilter={setSemesterFilter}
                subjectFilter={subjectFilter}
                setSubjectFilter={setSubjectFilter}
                showPrerequisites={showPrerequisites}
                setShowPrerequisites={setShowPrerequisites}
                showRelated={showRelated}
                setShowRelated={setShowRelated}
                searchOpen={searchOpen}
                setSearchOpen={setSearchOpen}
                viewRef={viewRef}
                onRefresh={setRefreshId}
              />
            }
          />
          <Route path="/memory" element={<KnowledgeHealth />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route
            path="/subjects"
            element={
              <SubjectsPage
                conceptsLive={conceptsLive}
                onOpenSubject={(subjectId) => {
                  setSemesterFilter("all")
                  setSubjectFilter(subjectId)
                  navigate("/knowledge")
                }}
              />
            }
          />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* compatibility redirects */}
          <Route path="/map" element={<Navigate to="/knowledge" replace />} />
          <Route path="/health" element={<Navigate to="/memory" replace />} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>

      {refreshId && (
        <RefreshModal
          concept={conceptsById[refreshId]}
          retention={retentionOverrides[refreshId] ?? conceptsById[refreshId]?.retention ?? 50}
          onClose={() => setRefreshId(null)}
          onReviewed={handleReviewed}
        />
      )}

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
