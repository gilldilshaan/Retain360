import React, { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import useDebounce from "../hooks/useDebounce";

import NotesHeader from "./notes/NotesHeader.jsx"
import FilterBar from "./notes/FilterBar.jsx"
import NotesGrid from "./notes/NotesGrid.jsx"
import EmptyState from "./notes/EmptyState.jsx"
import NoteDrawer from "./notes/NoteDrawer.jsx"
import NoteFormModal from "./notes/NoteFormModal.jsx"
import ConfirmModal from "./notes/ConfirmModal.jsx"

import { useNotes } from "../store/useNotes.js"
import { useToast } from "../context/ToastContext.jsx"
import { SUBJECTS, SEMESTERS, FILE_TYPES } from "../data/noteLibrary.js"

// The My Notes page.
// The notes data now comes from NotesContext (shared + saved in localStorage)
// and this page only keeps UI state: filters, sorting, which popup is open.
export default function NotesPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const {
    notes,
    pinnedIds,
    togglePin,
    recentSearches,
    setRecentSearches,
    addRecentSearch,
    addNote,
    updateNote,
    deleteNote,
    getRelatedNotes,
  } = useNotes()

  // ── search / filter / sort state ──
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 500);
  const [subjectFilter, setSubjectFilter] = useState("All")
  const [semesterFilter, setSemesterFilter] = useState("All")
  const [typeFilter, setTypeFilter] = useState("All")
  const [pinnedOnly, setPinnedOnly] = useState(false)
  const [sortBy, setSortBy] = useState("recent")
  const [visibleNotes, setVisibleNotes] = useState(8)

  // ── popup state ──
  const [selectedId, setSelectedId] = useState(null) // which note is open in the drawer
  const [formOpen, setFormOpen] = useState(false) // add/edit form
  const [noteToEdit, setNoteToEdit] = useState(null) // null = adding a new note
  const [noteToDelete, setNoteToDelete] = useState(null) // note waiting for delete confirmation

  // ── filtering + sorting ──
  // useMemo: only redo this work when one of the values in the [ ] list changes
  const filteredNotes = useMemo(() => {
    const searchText = debouncedQuery.trim().toLowerCase()

    // step 1: keep only the notes that match every filter
    const result = notes.filter((note) => {
      const matchesSearch =
        searchText === "" ||
        note.title.toLowerCase().includes(searchText) ||
        note.subject.toLowerCase().includes(searchText) ||
        (note.content || "").toLowerCase().includes(searchText) || // also search inside the written note
        note.tags.some((tag) => tag.toLowerCase().includes(searchText))

      const matchesSubject = subjectFilter === "All" || note.subject === subjectFilter
      const matchesSemester = semesterFilter === "All" || note.semester === semesterFilter
      const matchesType = typeFilter === "All" || note.type === typeFilter
      const matchesPinned = !pinnedOnly || pinnedIds.includes(note.id)

      return matchesSearch && matchesSubject && matchesSemester && matchesType && matchesPinned
    })

    // step 2: sort. We copy the list first ([...result]) so we never change the original.
    const sorted = [...result]
    if (sortBy === "recent") {
      sorted.sort((a, b) => b.updatedAt - a.updatedAt) // newest first
    } else if (sortBy === "title") {
      sorted.sort((a, b) => a.title.localeCompare(b.title)) // A to Z
    } else if (sortBy === "semester") {
      sorted.sort((a, b) => a.semester - b.semester) // sem 1 first
    }

    return sorted
  }, [notes, debouncedQuery, subjectFilter, semesterFilter, typeFilter, pinnedOnly, pinnedIds, sortBy])

  // ── the note shown in the drawer ──
  const selectedNote = notes.find((note) => note.id === selectedId) || null
  const relatedNotes = selectedNote ? getRelatedNotes(selectedNote) : []

  // ── actions ──
  const openInDrawer = (note) => setSelectedId(note.id)
  const openFullPage = (note) => navigate(`/notes/${note.id}`) // goes to the dynamic route

  const handleSearch = () => addRecentSearch(query)

  const openAddForm = () => {
    setNoteToEdit(null)
    setFormOpen(true)
  }

  const openEditForm = (note) => {
    setSelectedId(null) // close the drawer first
    setNoteToEdit(note)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setNoteToEdit(null)
  }

  // called by the form after validation passes
  const handleSave = (data, fileChange) => {
    if (noteToEdit) {
      updateNote(noteToEdit.id, data, fileChange)
      showToast("Note updated")
    } else {
      const created = addNote(data, fileChange?.file)
      showToast("Note added. Start writing!")
      closeForm()
      navigate(`/notes/${created.id}`) // open the new note so the user can write in it
      return
    }
    closeForm()
  }

  const handleDeleteConfirmed = () => {
    deleteNote(noteToDelete.id)
    showToast("Note deleted")
    setNoteToDelete(null)
    setSelectedId(null)
  }

  return (
    <div className="nlib">
      <NotesHeader
        query={query}
        setQuery={setQuery}
        recentSearches={recentSearches}
        setRecentSearches={setRecentSearches}
        onSearch={handleSearch}
        onAdd={openAddForm}
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
        sortBy={sortBy}
        setSortBy={setSortBy}
        pinnedIds={pinnedIds}
        subjects={SUBJECTS}
        semesters={SEMESTERS}
        fileTypes={FILE_TYPES}
        resultCount={filteredNotes.length}
        totalCount={notes.length}
      />

      {filteredNotes.length > 0 ? (
        <>
          <NotesGrid
            notes={filteredNotes.slice(0, visibleNotes)}
            pinnedIds={pinnedIds}
            onPin={togglePin}
            onOpen={openInDrawer}
            onView={openFullPage}
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
        onOpen={openFullPage}
        onRelatedClick={setSelectedId}
        onEdit={openEditForm}
        onDelete={setNoteToDelete}
      />

      {formOpen && <NoteFormModal note={noteToEdit} onSave={handleSave} onClose={closeForm} />}

      {noteToDelete && (
        <ConfirmModal note={noteToDelete} onConfirm={handleDeleteConfirmed} onCancel={() => setNoteToDelete(null)} />
      )}
    </div>
  )
}
