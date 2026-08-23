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

import { concepts, conceptsById } from "./data/concepts.js"

// Small text shown in the header for whichever page is open.
const PAGE_META = {
  "/": { eyebrow: "My Knowledge", title: "Dashboard", sub: "Your whole degree, one connected system." },
  "/map": { eyebrow: "My Knowledge", title: "Knowledge Map", sub: "See how everything you've learned connects." },
  "/health": { eyebrow: "My Knowledge", title: "Knowledge Health", sub: "What you remember — and what's fading." },
  "/notes": { eyebrow: "My Library", title: "My Notes", sub: "Everything you've written, searchable." },
  "/subjects": { eyebrow: "My Knowledge", title: "Subjects", sub: "Courses across all four years." },
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
  const viewRef = useRef(null)

  // ── recent activity (mock list, grows when you review a concept) ──
  const [activities, setActivities] = useState([
    { id: "a2", icon: "→", text: "Explored Neural Networks", when: "Today" },
    { id: "a1", icon: "→", text: "Opened Mathematics", when: "Yesterday" },
  ])

  const location = useLocation()
  const navigate = useNavigate()
  const pageMeta = PAGE_META[location.pathname] || PAGE_META["/"]
  const onMapPage = location.pathname === "/map"

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

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

  // ── shared actions ──

  // Used by Dashboard / Notes / Health / Subjects:
  // select a concept and land on its node in the map.
  const goToConcept = useCallback(
    (id) => {
      setSelectedId(id)
      navigate("/map")
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

  return (
    <div className="app">
      <Sidebar active={location.pathname} onNavigate={(path) => navigate(path)} />

      <main className="main">
        <TopHeader
          meta={pageMeta}
          onOpenSearch={onMapPage ? () => setSearchOpen((o) => !o) : undefined}
        />

        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                conceptsLive={conceptsLive}
                conceptsLiveById={conceptsLiveById}
                activities={activities}
                onExplore={goToConcept}
              />
            }
          />
          <Route
            path="/map"
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
            path="/health"
            element={<KnowledgeHealth conceptsLive={conceptsLive} onSelectConcept={goToConcept} />}
          />
          <Route path="/notes" element={<NotesPage conceptsLiveById={conceptsLiveById} onSelectConcept={goToConcept} />} />
          <Route
            path="/subjects"
            element={
              <SubjectsPage
                conceptsLive={conceptsLive}
                onOpenSubject={(subjectId) => {
                  setSemesterFilter("all")
                  setSubjectFilter(subjectId)
                  navigate("/map")
                }}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
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