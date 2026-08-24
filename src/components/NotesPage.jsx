import React, { useState } from "react"

import NotesHeader from "./notes/NotesHeader.jsx"
import FilterBar from "./notes/FilterBar.jsx"
import NotesGrid from "./notes/NotesGrid.jsx"
import EmptyState from "./notes/EmptyState.jsx"
import NoteDrawer from "./notes/NoteDrawer.jsx"

import { NOTES, SUBJECTS, SEMESTERS, FILE_TYPES } from "../data/noteLibrary.js"

// The My Notes page — teammate's library UI running inside Retain360.
// All state is local here; data comes from src/data/noteLibrary.js so it
// can later be swapped for an API without touching the components.
export default function NotesPage() {
  const [query, setQuery] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("All")
  const [semesterFilter, setSemesterFilter] = useState("All")
  const [typeFilter, setTypeFilter] = useState("All")
  const [pinnedOnly, setPinnedOnly] = useState(false)
  const [pinnedIds, setPinnedIds] = useState([1, 6])
  const [recentSearches, setRecentSearches] = useState(["matrix", "gradient descent", "eigenvalues"])

  const [selectedId, setSelectedId] = useState(null)
  const [visibleNotes, setVisibleNotes] = useState(8)

  // pin / unpin
  const togglePin = (id) => {
    setPinnedIds((previous) => {
      if (previous.includes(id)) {
        return previous.filter((item) => item !== id)
      }
      return [...previous, id]
    })
  }

  const openNote = (note) => setSelectedId(note.id)

  // recent searches
  const handleSearch = () => {
    const term = query.trim()
    if (term && !recentSearches.some((search) => search.toLowerCase() === term.toLowerCase())) {
      setRecentSearches([term, ...recentSearches])
    }
  }

  // filtering
  const searchText = query.trim().toLowerCase()

  const filteredNotes = NOTES.filter((note) => {
    let matchesSearch = true

    if (searchText !== "") {
      matchesSearch =
        note.title.toLowerCase().includes(searchText) ||
        note.subject.toLowerCase().includes(searchText)

      if (!matchesSearch) {
        for (let tag of note.tags) {
          if (tag.toLowerCase().includes(searchText)) {
            matchesSearch = true
            break
          }
        }
      }
    }

    let matchesSubject = true
    if (subjectFilter !== "All") matchesSubject = note.subject === subjectFilter

    let matchesSemester = true
    if (semesterFilter !== "All") matchesSemester = note.semester === semesterFilter

    let matchesType = true
    if (typeFilter !== "All") matchesType = note.type === typeFilter

    let matchesPinned = true
    if (pinnedOnly) matchesPinned = pinnedIds.includes(note.id)

    return matchesSearch && matchesSubject && matchesSemester && matchesType && matchesPinned
  })

  // selected note
  let selectedNote = null
  for (let note of NOTES) {
    if (note.id === selectedId) {
      selectedNote = note
      break
    }
  }

  // notes related to the selected note
  let relatedNotes = []
  if (selectedNote) {
    for (let title of selectedNote.related) {
      for (let note of NOTES) {
        if (note.title === title) {
          relatedNotes.push(note)
          break
        }
      }
    }
  }

  return (
    <div className="nlib">
      <NotesHeader
        query={query}
        setQuery={setQuery}
        recentSearches={recentSearches}
        setRecentSearches={setRecentSearches}
        onSearch={handleSearch}
      />

      <FilterBar
        subjectFilter={subjectFilter}
        setSubjectFilter={setSubjectFilter}
        semesterFilter={semesterFilter}
        setSemesterFilter={setSemesterFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        pinnedOnly={pinnedOnly}
        setPinnedOnly={setPinnedOnly}
        pinnedIds={pinnedIds}
        subjects={SUBJECTS}
        semesters={SEMESTERS}
        fileTypes={FILE_TYPES}
        resultCount={filteredNotes.length}
        totalCount={NOTES.length}
      />

      {filteredNotes.length > 0 ? (
        <>
          <NotesGrid
            notes={filteredNotes.slice(0, visibleNotes)}
            pinnedIds={pinnedIds}
            onPin={togglePin}
            onOpen={openNote}
          />

          {filteredNotes.length > visibleNotes && (
            <div className="see-more-wrapper">
              <button className="see-more-btn" onClick={() => setVisibleNotes(visibleNotes + 4)}>
                See more<span>↓</span>
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState query={query} />
      )}

      <NoteDrawer
        note={selectedNote}
        relatedNotes={relatedNotes}
        isPinned={selectedNote ? pinnedIds.includes(selectedNote.id) : false}
        onClose={() => setSelectedId(null)}
        onPin={togglePin}
        onOpen={openNote}
        onRelatedClick={setSelectedId}
      />
    </div>
  )
}