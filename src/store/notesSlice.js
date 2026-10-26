import { createSlice } from "@reduxjs/toolkit"
import { NOTES } from "../data/noteLibrary.js"

// Redux Toolkit slice = state + the functions (reducers) that change it.
// It replaces the old NotesContext. It holds:
//   notes           -> all notes
//   pinnedIds       -> ids of pinned notes
//   recentSearches  -> last searches typed in the search box
//
// Reducers must stay PURE (no IndexedDB, no toast, no localStorage here).
// Side effects live in useNotes.js (files) and the components (toast).

// ── localStorage keys (same keys as before, so saved data is not lost) ──
export const STORAGE_KEYS = {
  notes: "retain360-notes-v2",
  pinnedIds: "retain360-pinned",
  recentSearches: "retain360-recent",
}

const ONE_DAY = 24 * 60 * 60 * 1000

// Sample notes say "3 weeks ago" (text). For sorting we need a real number.
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

const defaultState = {
  notes: startingNotes,
  pinnedIds: [1, 6],
  recentSearches: ["matrix", "gradient descent", "eigenvalues"],
}

// read one saved value, or use the default when nothing is saved / it is broken
function readSaved(key, fallback) {
  try {
    const saved = localStorage.getItem(key)
    return saved !== null ? JSON.parse(saved) : fallback
  } catch (error) {
    console.log("Could not read from localStorage", error)
    return fallback
  }
}

// used by store.js as the starting state
export function loadNotesState() {
  return {
    notes: readSaved(STORAGE_KEYS.notes, defaultState.notes),
    pinnedIds: readSaved(STORAGE_KEYS.pinnedIds, defaultState.pinnedIds),
    recentSearches: readSaved(STORAGE_KEYS.recentSearches, defaultState.recentSearches),
  }
}

const notesSlice = createSlice({
  name: "notes",
  initialState: defaultState,
  reducers: {
    // ── CREATE ──
    // "prepare" builds the payload BEFORE the reducer runs, so the reducer stays pure
    // (Date.now() is not pure) and the component gets the new note back from dispatch().
    addNote: {
      prepare(data) {
        const id = data.id ?? Date.now()
        return {
          payload: {
            type: "NOTE", // written by hand, unless data.type says otherwise
            ...data,
            id,
            related: [],
            updated: "Just now",
            updatedAt: Date.now(),
          },
        }
      },
      reducer(state, action) {
        state.notes.unshift(action.payload) // new note goes to the top
      },
    },

    // ── UPDATE ──
    // dispatch(updateNote(id, data))
    updateNote: {
      prepare(id, data) {
        return { payload: { id, data, updatedAt: Date.now() } }
      },
      reducer(state, action) {
        const { id, data, updatedAt } = action.payload
        const note = state.notes.find((n) => n.id === id)
        if (!note) return
        Object.assign(note, data, { updated: "Just now", updatedAt })
      },
    },

    // ── DELETE ──
    deleteNote(state, action) {
      const id = action.payload
      state.notes = state.notes.filter((note) => note.id !== id)
      state.pinnedIds = state.pinnedIds.filter((pinnedId) => pinnedId !== id) // also remove its pin
    },

    // ── PIN / UNPIN ──
    togglePin(state, action) {
      const id = action.payload
      if (state.pinnedIds.includes(id)) {
        state.pinnedIds = state.pinnedIds.filter((pinnedId) => pinnedId !== id)
      } else {
        state.pinnedIds.push(id)
      }
    },

    // ── RECENT SEARCHES ──
    addRecentSearch(state, action) {
      const cleanTerm = action.payload.trim()
      if (cleanTerm === "") return

      const alreadyThere = state.recentSearches.some((s) => s.toLowerCase() === cleanTerm.toLowerCase())
      if (!alreadyThere) {
        state.recentSearches = [cleanTerm, ...state.recentSearches].slice(0, 6) // keep only 6
      }
    },

    // used by the "clear" / "remove one" buttons in the search dropdown
    setRecentSearches(state, action) {
      state.recentSearches = action.payload
    },
  },
})

export const { addNote, updateNote, deleteNote, togglePin, addRecentSearch, setRecentSearches } = notesSlice.actions

// ── selectors (small functions that read from the state) ──
export const selectNotes = (state) => state.notes.notes
export const selectPinnedIds = (state) => state.notes.pinnedIds
export const selectRecentSearches = (state) => state.notes.recentSearches

export default notesSlice.reducer