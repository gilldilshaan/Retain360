import React, { useState, useEffect, useMemo, useRef, useCallback } from "react"

import Sidebar from "./components/Sidebar.jsx"
import TopHeader from "./components/TopHeader.jsx"
import GraphToolbar from "./components/GraphToolbar.jsx"
import KnowledgeGraph from "./components/KnowledgeGraph.jsx"
import ConceptInspector from "./components/ConceptInspector.jsx"
import RefreshModal from "./components/RefreshModal.jsx"
import SearchConcepts from "./components/SearchConcepts.jsx"
import Legend from "./components/Legend.jsx"

import { concepts, conceptsById } from "./data/concepts.js"
import { connections } from "./data/connections.js"

export default function App() {
  // ── graph state (lifted here so toolbar / search / inspector share it) ──
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

  // ⌘K / Ctrl+K opens concept search
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setSearchOpen((o) => !o)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  // retention values with any "mark as reviewed" overrides applied
  const conceptsLive = useMemo(
    () =>
      concepts.map((c) =>
        retentionOverrides[c.id] !== undefined
          ? { ...c, retention: retentionOverrides[c.id] }
          : c
      ),
    [retentionOverrides]
  )
  const conceptsLiveById = useMemo(
    () => Object.fromEntries(conceptsLive.map((c) => [c.id, c])),
    [conceptsLive]
  )

  // ── derived: filtered nodes + edges ──
  const visibleConcepts = useMemo(
    () =>
      conceptsLive.filter((c) => {
        if (semesterFilter !== "all" && String(c.semester) !== String(semesterFilter)) return false
        if (subjectFilter !== "all" && c.subject !== subjectFilter) return false
        return true
      }),
    [conceptsLive, semesterFilter, subjectFilter]
  )

  const visibleIds = useMemo(() => new Set(visibleConcepts.map((c) => c.id)), [visibleConcepts])

  const visibleConnections = useMemo(
    () =>
      connections.filter((e) => {
        if (!visibleIds.has(e.source) || !visibleIds.has(e.target)) return false
        if (e.type === "prerequisite") return showPrerequisites
        if (e.type === "used in") return showRelated
        return true
      }),
    [visibleIds, showPrerequisites, showRelated]
  )

  const selectedConcept = selectedId ? conceptsLiveById[selectedId] : null

  const handleSelectNode = useCallback((id) => setSelectedId(id), [])
  const handleClearSelection = useCallback(() => setSelectedId(null), [])

  const handleSearchPick = useCallback((id) => {
    setSelectedId(id)
    setSearchOpen(false)
    // let the inspector mount before panning the graph to the node
    requestAnimationFrame(() => viewRef.current?.focusOn(id))
  }, [])

  const openRefresh = useCallback((id) => setRefreshId(id), [])

  const handleReviewed = useCallback((id) => {
    setRetentionOverrides((prev) => ({
      ...prev,
      [id]: Math.min(100, Math.round(((prev[id] ?? conceptsById[id]?.retention) ?? 50) + 14)),
    }))
    setToast(`${conceptsById[id]?.name} reviewed — retention updated`)
    setRefreshId(null)
  }, [])

  return (
    <div className="app">
      <Sidebar active="map" />

      <main className="main">
        <TopHeader onOpenSearch={() => setSearchOpen((o) => !o)} />

        <GraphToolbar
          semester={semesterFilter}
          subject={subjectFilter}
          onSemester={setSemesterFilter}
          onSubject={setSubjectFilter}
          showPrerequisites={showPrerequisites}
          showRelated={showRelated}
          onTogglePrerequisites={setShowPrerequisites}
          onToggleRelated={setShowRelated}
          onZoomIn={() => viewRef.current?.zoomIn()}
          onZoomOut={() => viewRef.current?.zoomOut()}
          onFit={() => viewRef.current?.fit()}
          onReset={() => viewRef.current?.reset()}
          conceptCount={visibleConcepts.length}
          connectionCount={visibleConnections.length}
        />

        <div className="workspace">
          <div className="graph-wrap">
            {visibleConcepts.length === 0 ? (
              <div className="graph-empty">
                <h3 className="serif">No concepts match these filters.</h3>
                <p>Try widening the semester or subject filter.</p>
                <button
                  type="button"
                  className="btn btn-quiet"
                  onClick={() => {
                    setSemesterFilter("all")
                    setSubjectFilter("all")
                  }}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <KnowledgeGraph
                concepts={visibleConcepts}
                connections={connections.filter(
                  (e) => visibleIds.has(e.source) && visibleIds.has(e.target)
                )}
                selectedId={selectedId}
                hoveredId={hoveredId}
                onSelect={handleSelectNode}
                onHover={setHoveredId}
                onClear={handleClearSelection}
                showPrerequisites={showPrerequisites}
                showRelated={showRelated}
                viewRef={viewRef}
              />
            )}
            <Legend showPrerequisites={showPrerequisites} showRelated={showRelated} />
          </div>

          <ConceptInspector
            key={selectedId || "empty"}
            concept={selectedConcept}
            onSelectConcept={handleSelectNode}
            onRefresh={openRefresh}
            lookup={conceptsLiveById}
          />
        </div>
      </main>

      <SearchConcepts
        concepts={conceptsLive}
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={handleSearchPick}
      />

      {refreshId && (
        <RefreshModal
          concept={conceptsById[refreshId]}
          retention={
            retentionOverrides[refreshId] ?? conceptsById[refreshId]?.retention ?? 50
          }
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