import { configureStore } from "@reduxjs/toolkit"
import notesReducer, { loadNotesState, STORAGE_KEYS } from "./notesSlice.js"
import conceptsReducer from "./conceptsSlice.js"

// The one Redux store for the app.
// Right now it has the "notes" and "concepts" slices; more slices can be added later.
export const store = configureStore({
  reducer: {
    notes: notesReducer,
    concepts: conceptsReducer,
  },
  // start from what was saved in localStorage (or the sample notes)
  preloadedState: {
    notes: loadNotesState(),
  },
})

// Save to localStorage whenever notes / pins / searches change,
// so everything survives a page refresh (this replaces useLocalStorage).
let last = {}
store.subscribe(() => {
  const current = store.getState().notes
  for (const key of Object.keys(STORAGE_KEYS)) {
    if (current[key] === last[key]) continue // this part did not change, skip it
    try {
      localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(current[key]))
    } catch (error) {
      console.log("Could not save to localStorage", error)
    }
    last[key] = current[key]
  }
})
