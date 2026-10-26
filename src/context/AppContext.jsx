import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { concepts, conceptsById } from "../data/concepts.js"
import { buildNotifications } from "../components/dashboard/NotificationsPanel.jsx"
import { useToast } from "./ToastContext.jsx"

// Derived status based on standard thresholds (aligns with KnowledgeHealth: >=75 strong, 55-74 normal, <55 fading)
export function deriveStatus(retention) {
  if (retention >= 75) return "strong"
  if (retention >= 55) return "normal"
  return "fading"
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const navigate = useNavigate()
  const toastCtx = useToast()

  // ── Graph selection & viewport ref ──
  const [selectedId, setSelectedId] = useState(null)
  const viewRef = useRef(null)

  // ── Retention overrides & Review modal ──
  const [retentionOverrides, setRetentionOverrides] = useState({})
  const [refreshId, setRefreshId] = useState(null)
  const [toast, setToast] = useState(null)

  // ── Recent activities ──
  const [activities, setActivities] = useState([
    { id: "a2", icon: "→", text: "Explored Neural Networks", when: "Today", conceptId: "neural-networks" },
    { id: "a1", icon: "→", text: "Opened Matrices", when: "Yesterday", conceptId: "matrices" },
  ])

  // Toast notification auto-dismissal
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  // ── Live concepts with retention overrides and dynamic status applied ──
  const conceptsLive = useMemo(
    () =>
      concepts.map((c) => {
        if (retentionOverrides[c.id] === undefined) return c
        const liveRetention = retentionOverrides[c.id]
        return {
          ...c,
          retention: liveRetention,
          status: deriveStatus(liveRetention),
        }
      }),
    [retentionOverrides]
  )

  const conceptsLiveById = useMemo(
    () => Object.fromEntries(conceptsLive.map((c) => [c.id, c])),
    [conceptsLive]
  )

  const notifications = useMemo(() => buildNotifications(conceptsLive), [conceptsLive])

  // ── Shared Actions ──

  // Deep-link to a concept: updates selection, navigates to /knowledge, centers graph node, logs activity
  const goToConcept = useCallback(
    (id) => {
      if (!id) return
      setSelectedId(id)
      navigate("/knowledge")
      requestAnimationFrame(() => {
        try {
          viewRef.current?.focusOn(id)
        } catch {
          // ignore if viewRef unmounted or not ready
        }
      })
      const concept = conceptsById[id]
      if (concept) {
        setActivities((prev) => [
          { id: `a${Date.now()}`, icon: "→", text: `Explored ${concept.name}`, when: "Just now", conceptId: id },
          ...prev.filter((a) => !(a.conceptId === id && a.icon === "→")),
        ])
      }
    },
    [navigate]
  )

  // Execute a concept review (+14 retention bump, toast banner, activity entry, closes modal)
  const handleReviewed = useCallback(
    (id) => {
      const concept = conceptsById[id]
      setRetentionOverrides((prev) => ({
        ...prev,
        [id]: Math.min(100, Math.round(((prev[id] ?? concept?.retention) ?? 50) + 14)),
      }))
      const msg = `${concept?.name || "Concept"} reviewed — retention updated`
      setToast(msg)
      toastCtx?.showToast?.(msg)
      setRefreshId(null)
      setActivities((prev) => [
        { id: `a${Date.now()}`, icon: "✓", text: `Reviewed ${concept?.name || id}`, when: "Just now", conceptId: id },
        ...prev,
      ])
    },
    [toastCtx]
  )

  const value = useMemo(
    () => ({
      conceptsLive,
      conceptsLiveById,
      retentionOverrides,
      activities,
      notifications,
      selectedId,
      setSelectedId,
      viewRef,
      goToConcept,
      refreshId,
      setRefreshId,
      handleReviewed,
      toast,
      setToast,
    }),
    [
      conceptsLive,
      conceptsLiveById,
      retentionOverrides,
      activities,
      notifications,
      selectedId,
      goToConcept,
      refreshId,
      handleReviewed,
      toast,
    ]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}

export default AppContext
