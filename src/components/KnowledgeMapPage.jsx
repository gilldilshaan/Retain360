import React, { useEffect, useMemo } from "react"

import GraphToolbar from "./GraphToolbar.jsx"
import KnowledgeGraph from "./KnowledgeGraph.jsx"
import ConceptInspector from "./ConceptInspector.jsx"
import SearchConcepts from "./SearchConcepts.jsx"
import Legend from "./Legend.jsx"

import { concepts } from "../data/concepts.js"
import { connections } from "../data/connections.js"

// The Knowledge Map screen. All state lives in App — this component only
// arranges toolbar + graph + inspector and passes callbacks up.
export default function KnowledgeMapPage({
  conceptsLive,
  conceptsLiveById,
  selectedId,
  setSelectedId,
  hoveredId,
  setHoveredId,
  semesterFilter,
  setSemesterFilter,
  subjectFilter,
  setSubjectFilter,
  showPrerequisites,
  setShowPrerequisites,
  showRelated,
  setShowRelated,
  searchOpen,
  setSearchOpen,
  viewRef,
  onRefresh,
}) {
  // ⌘K / Ctrl+K opens concept search (map page only)
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setSearchOpen((o) => !o)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [setSearchOpen])

  const resetFilters = () => {
    setSemesterFilter("all")
    setSubjectFilter("all")
    setShowPrerequisites(true)
    setShowRelated(true)
  }

  // ── derived data ──

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

  const mapConnections = useMemo(
    () => connections.filter((e) => visibleIds.has(e.source) && visibleIds.has(e.target)),
    [visibleIds]
  )

  const connectionCount = useMemo(
    () =>
      mapConnections.filter((e) => {
        if (e.type === "prerequisite") return showPrerequisites
        if (e.type === "used in") return showRelated
        return true
      }).length,
    [mapConnections, showPrerequisites, showRelated]
  )

  const selectedConcept = selectedId ? conceptsLiveById[selectedId] : null

  return (
    <>
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
        onResetFilters={resetFilters}
        conceptCount={visibleConcepts.length}
        connectionCount={connectionCount}
      />

      <div className="workspace">
        <div className="graph-wrap">
          {visibleConcepts.length === 0 ? (
            <div className="graph-empty">
              <h3 className="serif">No concepts match these filters.</h3>
              <p>Try changing your semester or subject.</p>
              <button type="button" className="btn btn-quiet" onClick={resetFilters}>
                Reset Filters
              </button>
            </div>
          ) : (
            <KnowledgeGraph
              concepts={visibleConcepts}
              connections={mapConnections}
              selectedId={selectedId}
              hoveredId={hoveredId}
              onSelect={setSelectedId}
              onHover={setHoveredId}
              onClear={() => setSelectedId(null)}
              showPrerequisites={showPrerequisites}
              showRelated={showRelated}
              viewRef={viewRef}
            />
          )}
          <Legend />
        </div>

        <ConceptInspector
          key={selectedId || "empty"}
          concept={selectedConcept}
          onSelectConcept={setSelectedId}
          onRefresh={onRefresh}
          lookup={conceptsLiveById}
        />
      </div>

      <SearchConcepts
        concepts={concepts}
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={(id) => {
          setSelectedId(id)
          setSearchOpen(false)
          requestAnimationFrame(() => viewRef.current?.focusOn(id))
        }}
      />
    </>
  )
}