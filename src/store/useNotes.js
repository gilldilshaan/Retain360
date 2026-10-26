import { useCallback, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  addNote as addNoteAction,
  updateNote as updateNoteAction,
  deleteNote as deleteNoteAction,
  togglePin as togglePinAction,
  addRecentSearch as addRecentSearchAction,
  setRecentSearches as setRecentSearchesAction,
  selectNotes,
  selectPinnedIds,
  selectRecentSearches,
} from "./notesSlice.js"
import { saveFile, removeFile } from "../utils/fileStore.js"

// Same API as the old Context hook:  const { notes, addNote } = useNotes()
// but now everything comes from the Redux store.
//
// Why a hook and not plain dispatch() in every component?
//   - uploaded files live in IndexedDB (a side effect), and reducers must be pure,
//     so addNote / updateNote / deleteNote also save or remove the file here.
export function useNotes() {
  const dispatch = useDispatch()
  const notes = useSelector(selectNotes)
  const pinnedIds = useSelector(selectPinnedIds)
  const recentSearches = useSelector(selectRecentSearches)

  // file (optional) = a real File chosen by the user; it is stored in IndexedDB
  const addNote = useCallback(
    (data, file) => {
      const action = dispatch(addNoteAction(data))
      const newNote = action.payload
      if (file) saveFile(newNote.id, file).catch(console.error)
      return newNote
    },
    [dispatch]
  )

  // fileChange (optional): { file } to attach / replace, { remove: true } to remove
  const updateNote = useCallback(
    (id, data, fileChange) => {
      if (fileChange?.file) saveFile(id, fileChange.file).catch(console.error)
      if (fileChange?.remove) removeFile(id).catch(console.error)
      dispatch(updateNoteAction(id, data))
    },
    [dispatch]
  )

  const deleteNote = useCallback(
    (id) => {
      dispatch(deleteNoteAction(id))
      removeFile(id).catch(console.error) // also delete its uploaded file, if any
    },
    [dispatch]
  )

  const togglePin = useCallback((id) => dispatch(togglePinAction(id)), [dispatch])
  const addRecentSearch = useCallback((term) => dispatch(addRecentSearchAction(term)), [dispatch])
  const setRecentSearches = useCallback((list) => dispatch(setRecentSearchesAction(list)), [dispatch])

  // ── helpers ──
  const getNoteById = useCallback((id) => notes.find((note) => note.id === id), [notes])

  // "related" stores titles, so we look up the notes with those titles
  const getRelatedNotes = useCallback(
    (note) =>
      note.related
        .map((title) => notes.find((n) => n.title === title))
        .filter((n) => n !== undefined), // remove titles that no longer exist
    [notes]
  )

  return useMemo(
    () => ({
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
    }),
    [notes, pinnedIds, recentSearches, setRecentSearches, addNote, updateNote, deleteNote, togglePin, addRecentSearch, getNoteById, getRelatedNotes]
  )
}