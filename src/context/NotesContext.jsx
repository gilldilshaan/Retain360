import React, { createContext, useContext } from "react"
import useLocalStorage from "../hooks/useLocalStorage.js"
import { NOTES } from "../data/noteLibrary.js"
import { saveFile, removeFile } from "../utils/fileStore.js"

// NotesContext = one shared box that holds everything about notes:
//   - the notes list
//   - pinned note ids
//   - recent searches
//   - functions to add / edit / delete / pin
// Any component can open the box with  useNotes()  -- no prop drilling.

const NotesContext = createContext(null)

const ONE_DAY = 24 * 60 * 60 * 1000

// Our sample notes say things like "3 weeks ago" (text).
// For sorting we need a real number, so we convert the text into a date once.
function textToTimestamp(text) {
  const match = text.match(/(\d+)\s*(day|week|month)/)
  if (!match) return Date.now()

  const amount = Number(match[1])
  let days = 1
  if (match[2] === "week") days = 7
  if (match[2] === "month") days = 30

  return Date.now() - amount * days * ONE_DAY
}

const startingNotes = NOTES.map((note) => ({
  ...note,
  updatedAt: textToTimestamp(note.updated),
}))

export function NotesProvider({ children }) {
  // these three are saved in localStorage, so they survive a refresh
  const [notes, setNotes] = useLocalStorage("retain360-notes-v2", startingNotes)
  const [pinnedIds, setPinnedIds] = useLocalStorage("retain360-pinned", [1, 6])
  const [recentSearches, setRecentSearches] = useLocalStorage("retain360-recent", [
    "matrix",
    "gradient descent",
    "eigenvalues",
  ])

  // ── CREATE ──
  // file (optional) = a real File chosen by the user; it is stored in IndexedDB
  const addNote = (data, file) => {
    const newNote = {
      type: "NOTE", // written by hand, unless data.type says otherwise
      ...data,
      id: Date.now(), // unique id
      related: [],
      updated: "Just now",
      updatedAt: Date.now(),
    }
    setNotes([newNote, ...notes]) // put the new note at the top
    if (file) saveFile(newNote.id, file).catch(console.error)
    return newNote
  }

  // ── UPDATE ──
  // fileChange (optional): { file } to attach / replace a file, { remove: true } to remove it
  const updateNote = (id, data, fileChange) => {
    if (fileChange?.file) saveFile(id, fileChange.file).catch(console.error)
    if (fileChange?.remove) removeFile(id).catch(console.error)

    const updatedList = notes.map((note) => {
      if (note.id === id) {
        return { ...note, ...data, updated: "Just now", updatedAt: Date.now() }
      }
      return note // other notes stay the same
    })
    setNotes(updatedList)
  }

  // ── DELETE ──
  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id))
    removeFile(id).catch(console.error) // also delete its uploaded file, if any
    setPinnedIds(pinnedIds.filter((pinnedId) => pinnedId !== id)) // also remove its pin
  }

  // ── PIN / UNPIN ──
  const togglePin = (id) => {
    if (pinnedIds.includes(id)) {
      setPinnedIds(pinnedIds.filter((pinnedId) => pinnedId !== id))
    } else {
      setPinnedIds([...pinnedIds, id])
    }
  }

  // ── RECENT SEARCHES ──
  const addRecentSearch = (term) => {
    const cleanTerm = term.trim()
    if (cleanTerm === "") return

    const alreadyThere = recentSearches.some((s) => s.toLowerCase() === cleanTerm.toLowerCase())
    if (!alreadyThere) {
      setRecentSearches([cleanTerm, ...recentSearches].slice(0, 6)) // keep only 6
    }
  }

  // ── HELPERS ──
  const getNoteById = (id) => notes.find((note) => note.id === id)

  // "related" stores titles, so we look up the notes with those titles
  const getRelatedNotes = (note) => {
    const found = note.related.map((title) => notes.find((n) => n.title === title))
    return found.filter((n) => n !== undefined) // remove titles that no longer exist
  }

  const value = {
    notes,
    pinnedIds,
    recentSearches,
    setRecentSearches,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
    addRecentSearch,
    getNoteById,
    getRelatedNotes,
  }

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
}

// small helper so components can write:  const { notes } = useNotes()
export function useNotes() {
  return useContext(NotesContext)
}
