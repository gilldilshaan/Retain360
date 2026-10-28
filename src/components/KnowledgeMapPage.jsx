
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

// The Knowledge Map screen combines App props with Redux-managed
// bookmark and mastery state.
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
  selectedId,
  setSelectedId,
  hoveredId,
  setHoveredId,
}) {
  const {
    bookmarkedIds,
    masteredIds,
    bookConcept,
    unbookConcept,
    bookmarkConcept,
    unbookmarkConcept,
    masterConcept,
    unmasterConcept,
    selectConcept,
  } = useConcepts()

// Helper: check if a concept is bookmarked or mastered from Redux
  const isBookmarked = (id) => bookmarkedIds.includes(id)
  const isMastered = (id) => masteredIds.includes(id)

  // Keep original filter/search state from props, with local state for toggle
  const [localSearchOpen, setLocalSearchOpen] = useState(searchOpen)
  const [localSemesterFilter, setLocalSemesterFilter] =
    useState(semesterFilter)
  const [localSubjectFilter, setLocalSubjectFilter] =
    useState(subjectFilter)
  const [localShowPrerequisites, setLocalShowPrerequisites] =
    useState(showPrerequisites)
  const [localShowRelated, setLocalShowRelated] = useState(showRelated)
  // Keep local controls synchronized with App props.
  useEffect(() => {
    setLocalSearchOpen(searchOpen)
  }, [searchOpen])

  useEffect(() => {
    setLocalSemesterFilter(semesterFilter)
  }, [semesterFilter])

  useEffect(() => {
    setLocalSubjectFilter(subjectFilter)
  }, [subjectFilter])

  useEffect(() => {
    setLocalShowPrerequisites(showPrerequisites)
  }, [showPrerequisites])

  useEffect(() => {
    setLocalShowRelated(showRelated)
  }, [showRelated])

  // Keep the Ctrl+K / Cmd+K search shortcut.
  useEffect(() => {
    const onKey = (event) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault()
        setLocalSearchOpen((open) => !open)
      }
    }

    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // Synchronize graph selection with Redux.
  const handleSelectConcept = (id) => {
    setSelectedId(id)
    if (id) {
      selectConcept(id)
    }
  }

  const resetFilters = () => {
    setLocalSemesterFilter("all")
    setLocalSubjectFilter("all")
    setLocalShowPrerequisites(true)
    setLocalShowRelated(true)

    setSemesterFilter("all")
    setSubjectFilter("all")
    setShowPrerequisites(true)
    setShowRelated(true)
  }

  // Derive the concepts visible under the current filters.
  const visibleConcepts = useMemo(
    () =>
      conceptsLive.filter((concept) => {
        if (
          localSemesterFilter !== "all" &&
          String(concept.semester) !== String(localSemesterFilter)
        ) {
          return false
        }

        if (
          localSubjectFilter !== "all" &&
          concept.subject !== localSubjectFilter
        ) {
          return false
        }

        return true
      }),
    [conceptsLive, localSemesterFilter, localSubjectFilter]
  )

  const visibleIds = useMemo(
    () => new Set(visibleConcepts.map((concept) => concept.id)),
    [visibleConcepts]
  )

  const mapConnections = useMemo(
    () =>
      connections.filter(
        (connection) =>
          visibleIds.has(connection.source) &&
          visibleIds.has(connection.target)
      ),
    [visibleIds]
  )

  const connectionCount = useMemo(
    () =>
      mapConnections.filter((connection) => {
        if (connection.type === "prerequisite") {
          return localShowPrerequisites
        }

        if (connection.type === "used in") {
          return localShowRelated
        }

        return true
      }).length,
    [mapConnections, localShowPrerequisites, localShowRelated]
  )

  const selectedConcept = selectedId
    ? conceptsLiveById[selectedId]
    : null

  return (
    <>
      <GraphToolbar
        semester={localSemesterFilter}
        subject={localSubjectFilter}
        onSemester={(value) => {
          setLocalSemesterFilter(value)
          setSemesterFilter(value)
        }}
        onSubject={(value) => {
          setLocalSubjectFilter(value)
          setSubjectFilter(value)
        }}
        showPrerequisites={localShowPrerequisites}
        showRelated={localShowRelated}
        onTogglePrerequisites={(value) => {
          setLocalShowPrerequisites(value)
          setShowPrerequisites(value)
        }}
        onToggleRelated={(value) => {
          setLocalShowRelated(value)
          setShowRelated(value)
        }}
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
              <svg
                width="40"
                height="32"
                viewBox="0 0 40 32"
                aria-hidden="true"
                style={{ color: "var(--ink-soft)" }}
              >
                <path
                  fill="none"
                  stroke="var(--ink-soft)"
                  strokeWidth={1.5}
                  d="M4 2 h32 M4 16 h32 M4 30 h16 M8 6 q8 12 q8 -12 M16 30 q0 -8 q8 0 q8 -8 M24 6 q8 12 q8 -12 M32 16 v8 M32 24 v8"
                />
              </svg>

              <h3 className="serif">
                No concepts match these filters.
              </h3>

              <p>
                Showing{" "}
                <span className="micro">
                  {visibleConcepts.length} of {conceptsLive.length}
                </span>{" "}
                concepts
              </p>

              <button
                type="button"
                className="btn btn-quiet"
                onClick={resetFilters}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <KnowledgeGraph
              concepts={visibleConcepts}
              connections={mapConnections}
              selectedId={selectedId}
              hoveredId={hoveredId}
              onSelect={handleSelectConcept}
              onHover={setHoveredId}
              onClear={() => setSelectedId(null)}
              showPrerequisites={localShowPrerequisites}
              showRelated={localShowRelated}
              viewRef={viewRef}
              bookmarkedIds={bookmarkedIds}
              masteredIds={masteredIds}
              bookmarkConcept={bookmarkConcept}
              unbookmarkConcept={unbookmarkConcept}
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
          concepts={conceptsLive}
          open={localSearchOpen}
          onClose={() => {
            setLocalSearchOpen(false)
            setSearchOpen(false)
          }}
          onSelect={(id) => {
            setSelectedId(id)
            setLocalSearchOpen(false)
            setSearchOpen(false)

            requestAnimationFrame(() => {
              viewRef.current?.focusOn(id)
            })
          }}
        />
      </div>
    </>
  )
}
