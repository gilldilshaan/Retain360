import React, { useState, useEffect, useMemo, useRef, useCallback } from "react"
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
import ProfilePage from "./components/ProfilePage.jsx"
import { buildNotifications } from "./components/dashboard/NotificationsPanel.jsx"

import { concepts, conceptsById } from "./data/concepts.js"

const PAGE_META = {
  "/dashboard": { eyebrow: "My Knowledge", title: "Dashboard", sub: "Your whole degree, one connected system." },
  "/knowledge": { eyebrow: "My Knowledge", title: "Knowledge Web", sub: "See how everything you've learned connects." },
  "/memory": { eyebrow: "My Knowledge", title: "Memory", sub: "What you remember — and what's fading." },
  "/notes": { eyebrow: "My Library", title: "My Notes", sub: "Everything you've written, searchable." },
  "/subjects": { eyebrow: "My Knowledge", title: "Subjects", sub: "Courses across all four years." },
  "/profile": { eyebrow: "Account", title: "Profile", sub: "Your academic snapshot at a glance." },
}

// BrowserRouter is provided in main.jsx; this component uses useLocation/useNavigate.
export default function App() {
  // ── graph state (single source of truth for the whole app) ──
  const [selectedId, setSelectedId] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)
  const [semesterFilter, setSemesterFilter] = useState("all")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [showPrerequisites, setShowPrerequisites] = useState(true)
  const [showRelated, setShowRelated] = useState(true)

  // ── ui state ──
  const [searchOpen, setSearchOpen] = useState(false)
  const [refreshId, setRefreshId] = useState(null)
  const [retentionOverrides, setRetentionOverrides] = useState({})
  const [toast, setToast] = useState(null)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const viewRef = useRef(null)

  // ── recent activity (mock list, grows when you review a concept) ──
  const [activities, setActivities] = useState([
    { id: "a2", icon: "→", text: "Explored Neural Networks", when: "Today" },
    { id: "a1", icon: "→", text: "Opened Mathematics", when: "Yesterday" },
  ])

  const location = useLocation()
  const navigate = useNavigate()
  const pageMeta = PAGE_META[location.pathname] || PAGE_META["/dashboard"]
  const onKnowledgePage = location.pathname === "/knowledge"

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  useEffect(() => {
    setMobileNavOpen(false)
  }, [location.pathname])

  // ── retention values with any "mark as reviewed" overrides applied ──
  const conceptsLive = useMemo(
    () =>
      concepts.map((c) =>
        retentionOverrides[c.id] !== undefined ? { ...c, retention: retentionOverrides[c.id] } : c
      ),
    [retentionOverrides]
  )
  const conceptsLiveById = useMemo(
    () => Object.fromEntries(conceptsLive.map((c) => [c.id, c])),
    [conceptsLive]
  )

  const notifications = useMemo(() => buildNotifications(conceptsLive), [conceptsLive])

  // ── shared actions ──

  // Used by Dashboard / Notes / Health / Subjects / Search:
  // select a concept and land on its node in the knowledge web.
  const goToConcept = useCallback(
    (id) => {
      setSelectedId(id)
      navigate("/knowledge")
      requestAnimationFrame(() => viewRef.current?.focusOn(id))
    },
    [navigate]
  )

  const handleReviewed = useCallback((id) => {
    setRetentionOverrides((prev) => ({
      ...prev,
      [id]: Math.min(100, Math.round(((prev[id] ?? conceptsById[id]?.retention) ?? 50) + 14)),
    }))
    setToast(`${conceptsById[id]?.name} reviewed — retention updated`)
    setRefreshId(null)
    setActivities((prev) => [
      { id: `a${Date.now()}`, icon: "✓", text: `Reviewed ${conceptsById[id]?.name}`, when: "Just now" },
      ...prev,
    ])
  }, [])

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
          onOpenSearch={onKnowledgePage ? () => setSearchOpen((o) => !o) : undefined}
          onToggleNav={() => setMobileNavOpen((o) => !o)}
          notifications={notifications}
        />

        <Routes>
          <Route
            path="/dashboard"
            element={
              <Dashboard
                conceptsLive={conceptsLive}
                conceptsLiveById={conceptsLiveById}
                activities={activities}
                notifications={notifications}
                onExplore={goToConcept}
              />
            }
          />
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
          <Route
            path="/memory"
            element={
              <KnowledgeHealth
                conceptsLive={conceptsLive}
                activities={activities}
                onSelectConcept={goToConcept}
                onRefresh={setRefreshId}
                onOpenSubject={(subjectId) => {
                  setSemesterFilter("all")
                  setSubjectFilter(subjectId)
                  navigate("/knowledge")
                }}
              />
            }
          />
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
          <Route path="/profile" element={<ProfilePage conceptsLive={conceptsLive} />} />

          {/* compatibility redirects */}
          <Route path="/map" element={<Navigate to="/knowledge" replace />} />
          <Route path="/health" element={<Navigate to="/memory" replace />} />
          <Route path="/search" element={<Navigate to="/notes" replace />} />

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
