import React, { useEffect, useMemo, useState } from "react"

import { useConcepts } from "../store/useConcepts"

import GraphToolbar from "./GraphToolbar.jsx"
import KnowledgeGraph from "./KnowledgeGraph.jsx"
import ConceptInspector from "./ConceptInspector.jsx"
import SearchConcepts from "./SearchConcepts.jsx"
import Legend from "./Legend.jsx"
import GraphHealth from "./GraphHealth.jsx"

import { concepts } from "../data/concepts.js"
import { connections } from "../data/connections.js"

// The Knowledge Map screen. State comes from App props (concepts data, filters)
// and from Redux (bookmark/mastery selection). Both sources are combined here.
export default function KnowledgeMapPage({
  conceptsLive,
  conceptsLiveById,
  activities,
  notifications,
  onExplore,
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
  const {
    bookmarkedIds,
    masteredIds,
    selectedId,
    bookConcept,
    unbookConcept,
    masterConcept,
    unmasterConcept,
    selectConcept,
    deselectConcept,
  } = useConcepts()

  // Helper: check if a concept is bookmarked or mastered from Redux
  const isBookmarked = (id) => bookmarkedIds.includes(id)
  const isMastered = (id) => masteredIds.includes(id)

  // Keep original filter/search state from props
  const [localSearchOpen, setLocalSearchOpen] = useState(searchOpen)
  const [localSemesterFilter, setLocalSemesterFilter] = useState(semesterFilter)
  const [localSubjectFilter, setLocalSubjectFilter] = useState(subjectFilter)
  const [localShowPrerequisites, setLocalShowPrerequisites] = useState(
    showPrerequisites
  )
  const [localShowRelated, setLocalShowRelated] = useState(showRelated)

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setLocalSearchOpen((o) => !o)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [setLocalSearchOpen])

  const resetFilters = () => {
    setLocalSemesterFilter("all")
    setLocalSubjectFilter("all")
    setLocalShowPrerequisites(true)
    setLocalShowRelated(true)
  }

  // ── derived data ──

  const visibleConcepts = useMemo(
    () =>
      conceptsLive.filter((c) => {
        if (localSemesterFilter !== "all" && String(c.semester) !== String(localSemesterFilter))
          return false
        if (localSubjectFilter !== "all" && c.subject !== localSubjectFilter) return false
        return true
      }),
    [conceptsLive, localSemesterFilter, localSubjectFilter]
  )

  const visibleIds = useMemo(() => new Set(visibleConcepts.map((c) => c.id)), [visibleConcepts])

  const mapConnections = useMemo(
    () => connections.filter((e) => visibleIds.has(e.source) && visibleIds.has(e.target)),
    [visibleIds]
  )

  const connectionCount = useMemo(
    () =>
      mapConnections.filter((e) => {
        if (e.type === "prerequisite") return localShowPrerequisites
        if (e.type === "used in") return localShowRelated
        return true
      }).length,
    [mapConnections, localShowPrerequisites, localShowRelated]
  )

  const selectedConcept = selectedId ? conceptsLiveById[selectedId] : null

  return (
    <>
      <GraphToolbar
        semester={localSemesterFilter}
        subject={localSubjectFilter}
        onSemester={setLocalSemesterFilter}
        onSubject={setLocalSubjectFilter}
        showPrerequisites={localShowPrerequisites}
        showRelated={localShowRelated}
        onTogglePrerequisites={setLocalShowPrerequisites}
        onToggleRelated={setLocalShowRelated}
        onZoomIn={() => viewRef.current?.zoomIn()}
        onZoomOut={() => viewRef.current?.zoomOut()}
        onFit={() => viewRef.current?.fit()}
        onReset={() => viewRef.current?.reset()}
        onResetFilters={resetFilters}
        conceptCount={visibleConcepts.length}
        connectionCount={connectionCount}
      />

      <GraphHealth conceptsLive={conceptsLive} />

      <div className="workspace">
        <div className="graph-wrap">
          {visibleConcepts.length === 0 ? (
            <div className="graph-empty">
              <svg width="40" height="32" viewBox="0 0 40 32" aria-hidden="true" style={{ color: "var(--ink-soft)" }}>
                <path fill="none" stroke="var(--ink-soft)" strokeWidth={1.5} d="M4 2 h32 M4 16 h32 M4 30 h16 M8 6 q8 12 q8 -12 M16 30 q0 -8 q8 0 q8 -8 M24 6 q8 12 q8 -12 M32 16 v8 M32 24 v8" />
              </svg>
              <h3 className="serif">No concepts match these filters.</h3>
              <p>Showing <span className="micro">{visibleConcepts.length} of {conceptsLive.length}</span> concepts</p>
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
              showPrerequisites={localShowPrerequisites}
              showRelated={localShowRelated}
              viewRef={viewRef}
              bookmarkedIds={bookmarkedIds}
              masteredIds={masteredIds}
              bookmarkConcept={bookConcept}
              unbookmarkConcept={unbookConcept}
              masterConcept={masterConcept}
              unmasterConcept={unmasterConcept}
              selectConcept={selectConcept}
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

        <SearchConcepts
          concepts={concepts}
          open={localSearchOpen}
          onClose={() => setLocalSearchOpen(false)}
          onSelect={(id) => {
            setSelectedId(id)
            setLocalSearchOpen(false)
            requestAnimationFrame(() => viewRef.current?.focusOn(id))
          }}
        />
      </div>
    </>
  )
}