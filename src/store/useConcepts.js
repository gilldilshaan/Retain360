import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  bookmarkConcept as bookmarkConceptAction,
  unbookmarkConcept as unbookmarkConceptAction,
  masterConcept as masterConceptAction,
  unmasterConcept as unmasterConceptAction,
  selectConcept as selectConceptAction,
  deselectConcept as deselectConceptAction,
} from "./conceptsSlice.js"

export function useConcepts() {
  const dispatch = useDispatch()

  const bookmarkedIds = useSelector((state) => state.concepts.bookmarkedIds)
  const masteredIds = useSelector((state) => state.concepts.masteredIds)
  const selectedId = useSelector((state) => state.concepts.selectedId)

  const bookmarkConcept = useCallback((id) => dispatch(bookmarkConceptAction(id)), [dispatch])
  const unbookmarkConcept = useCallback((id) => dispatch(unbookmarkConceptAction(id)), [dispatch])
  const masterConcept = useCallback((id) => dispatch(masterConceptAction(id)), [dispatch])
  const unmasterConcept = useCallback((id) => dispatch(unmasterConceptAction(id)), [dispatch])
  const selectConcept = useCallback((id) => dispatch(selectConceptAction(id)), [dispatch])
  const deselectConcept = useCallback(() => dispatch(deselectConceptAction()), [dispatch])

  return {
    bookmarkedIds,
    masteredIds,
    selectedId,
    bookmarkConcept,
    unbookmarkConcept,
    masterConcept,
    unmasterConcept,
    selectConcept,
    deselectConcept,
  }
}