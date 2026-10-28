import { createSlice } from "@reduxjs/toolkit"

export const conceptsInitialState = {
  bookmarkedIds: [],
  masteredIds: [],
  selectedId: null,
}

const conceptsSlice = createSlice({
  name: "concepts",
  initialState: conceptsInitialState,
  reducers: {
    // Bookmark a concept (add to bookmarked list)
    bookmarkConcept(state, action) {
      const id = action.payload
      if (state.bookmarkedIds.includes(id)) return
      state.bookmarkedIds = [...state.bookmarkedIds, id]
    },

    // Unbookmark a concept
    unbookmarkConcept(state, action) {
      const id = action.payload
      state.bookmarkedIds = state.bookmarkedIds.filter((i) => i !== id)
    },

    // Mark a concept as mastered (retention = 100%)
    masterConcept(state, action) {
      const id = action.payload
      state.masteredIds = [...state.masteredIds, id]
    },

    // Unmaster a concept
    unmasterConcept(state, action) {
      const id = action.payload
      state.masteredIds = state.masteredIds.filter((i) => i !== id)
    },

    // Select a concept (update the currently selected concept ID)
    selectConcept(state, action) {
      state.selectedId = action.payload
    },

    // Deselect a concept
    deselectConcept(state) {
      state.selectedId = null
    },
  },
})

export const {
  bookmarkConcept,
  unbookmarkConcept,
  masterConcept,
  unmasterConcept,
  selectConcept,
  deselectConcept,
} = conceptsSlice.actions

export default conceptsSlice.reducer