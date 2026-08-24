import React, { useState, useCallback, useEffect, useRef } from "react"
import { positionFor } from "../data/positions.js"
import { subjectOf } from "../data/subjects.js"
import { relatedChainIds } from "../data/connections.js"

const NODE_W = 196
const NODE_H = 62
const WORLD_W = 1320
const WORLD_H = 1050

// Subtle vertical separators let the eye read foundation → advanced
// without boxing every semester.
const BANDS = [
  { label: "SEM 1", sub: "FOUNDATIONS", x: 205, sepX: 355 },
  { label: "SEM 2", sub: "CORE COMPUTING", x: 505, sepX: 655 },
  { label: "SEM 3", sub: "SYSTEMS + AI", x: 810, sepX: 1000 },
  { label: "SEM 4", sub: "ADVANCED", x: 1240, sepX: 1300 },
]

const BOUNDS = { minX: 40, minY: 20, maxX: 1290, maxY: 1050 }
const MIN_SCALE = 0.22
const MAX_SCALE = 2.6

const dotColor = (status) =>
  ({ strong: "#5f6750", normal: "#798165", fading: "#c8a27a" }[status] || "#798165")

export default function KnowledgeGraph({
  concepts,
  connections,
  selectedId,
  hoveredId,
  onSelect,
  onHover,
  onClear,
  showPrerequisites,
  showRelated,
  viewRef,
}) {
  const areaRef = useRef(null)
  const [view, setView] = useState({ s: 0.62, tx: 0, ty: 0 })
  const [panning, setPanning] = useState(false)

  // drag bookkeeping lives in refs so re-renders never interrupt a gesture
  const drag = useRef({ active: false, startX: 0, startY: 0, baseTx: 0, baseTy: 0, moved: 0 })

  /* ── fit to viewport ── */
  const fit = useCallback(() => {
    const el = areaRef.current
    const vw = el?.clientWidth || 900
    const vh = el?.clientHeight || 640
    const bw = BOUNDS.maxX - BOUNDS.minX
    const bh = BOUNDS.maxY - BOUNDS.minY
    const s = Math.min(vw / bw, vh / bh) * 0.96
    setView({
      s,
      tx: (vw - bw * s) / 2 - BOUNDS.minX * s,
      ty: (vh - bh * s) / 2 - BOUNDS.minY * s,
    })
  }, [])

  useEffect(() => {
    fit()
  }, [fit])

  /* ── cursor-anchored zoom ── */
  const zoomAt = useCallback((px, py, factor) => {
    setView((prev) => {
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev.s * factor))
      if (next === prev.s) return prev
      // world point currently under the cursor stays under the cursor
      const wx = (px - prev.tx) / prev.s
      const wy = (py - prev.ty) / prev.s
      return { s: next, tx: px - wx * next, ty: py - wy * next }
    })
  }, [])

  // non-passive wheel listener so preventDefault actually blocks page scroll
  useEffect(() => {
    const el = areaRef.current
    if (!el) return
    const onWheel = (e) => {
      e.preventDefault()
      const rect = el.getBoundingClientRect()
      const px = e.clientX - rect.left
      const py = e.clientY - rect.top
      zoomAt(px, py, e.deltaY < 0 ? 1.12 : 1 / 1.12)
    }
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [zoomAt])

  const zoomAroundCenter = useCallback((factor) => {
    const el = areaRef.current
    zoomAt((el?.clientWidth || 900) / 2, (el?.clientHeight || 640) / 2, factor)
  }, [zoomAt])

  /* ── centre one concept in the viewport ── */
  const focusOn = useCallback((id) => {
    const pos = positionFor(id)
    if (!pos) return
    const el = areaRef.current
    const vw = el?.clientWidth || 900
    const vh = el?.clientHeight || 640
    setView((prev) => ({
      ...prev,
      tx: vw / 2 - (pos.x + NODE_W / 2) * prev.s,
      ty: vh / 2 - (pos.y + NODE_H / 2) * prev.s,
    }))
  }, [])

  /* ── imperative controls for the toolbar ── */
  useEffect(() => {
    if (!viewRef) return
    viewRef.current = {
      zoomIn: () => zoomAroundCenter(1.28),
      zoomOut: () => zoomAroundCenter(1 / 1.28),
      fit,
      reset: () => {
        onClear?.()
        fit()
      },
      focusOn,
    }
  }, [viewRef, zoomAroundCenter, fit, onClear, focusOn])

  /* ── drag to pan ── */
  const onPointerDown = (e) => {
    if (e.button !== 0) return
    drag.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      baseTx: view.tx,
      baseTy: view.ty,
      moved: 0,
    }
    setPanning(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (!drag.current.active) return
    const dx = e.clientX - drag.current.startX
    const dy = e.clientY - drag.current.startY
    drag.current.moved = Math.abs(dx) + Math.abs(dy)
    setView((prev) => ({ ...prev, tx: drag.current.baseTx + dx, ty: drag.current.baseTy + dy }))
  }

  const onPointerUp = () => {
    drag.current.active = false
    setPanning(false)
  }

  /* ── derived data ── */

  // transitive chain for the selected concept
  const chainIds = selectedId ? relatedChainIds(selectedId) : null

  const visibleEdges = connections.filter((e) => {
    if (e.type === "prerequisite") return showPrerequisites
    if (e.type === "used in") return showRelated
    return true
  })

  const hoveredConcept = hoveredId ? concepts.find((c) => c.id === hoveredId) : null

  /* curved edge: quadratic bezier bowed alternately left/right */
  const edgePath = (a, b, i) => {
    const x1 = a.x + NODE_W / 2
    const y1 = a.y + NODE_H / 2
    const x2 = b.x + NODE_W / 2
    const y2 = b.y + NODE_H / 2
    const dx = x2 - x1
    const dy = y2 - y1
    const dist = Math.hypot(dx, dy) || 1
    const bend = (i % 2 === 0 ? 1 : -1) * dist * 0.09
    const cx = (x1 + x2) / 2 + (-dy / dist) * bend
    const cy = (y1 + y2) / 2 + (dx / dist) * bend
    return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`
  }

  return (
    <div className={`graph-area${panning ? " panning" : ""}`} ref={areaRef}>
      <div
        className="graph-canvas"
        role="application"
        aria-label="Knowledge graph"
        onClick={(e) => {
          // a drag should not clear the selection
          if (drag.current.moved > 5) return
          if (e.target === e.currentTarget) onClear?.()
        }}
        onDoubleClick={fit}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        style={{
          width: WORLD_W,
          height: WORLD_H,
          transform: `translate(${view.tx}px, ${view.ty}px) scale(${view.s})`,
        }}
      >
        <svg width={WORLD_W} height={WORLD_H} className="graph-svg" aria-hidden="true">
          {BANDS.map((b) => (
            <g key={b.label}>
              <line x1={b.sepX} y1={16} x2={b.sepX} y2={WORLD_H} stroke="rgba(44,39,37,0.08)" strokeDasharray="2 7" />
              <text x={b.x} y={26} textAnchor="middle" fontSize="11.5" fontWeight="600" letterSpacing="2.4" fill="rgba(44,39,37,0.45)">
                {b.label}
              </text>
              <text x={b.x} y={42} textAnchor="middle" fontSize="9" letterSpacing="1.8" fill="rgba(44,39,37,0.32)">
                {b.sub}
              </text>
            </g>
          ))}

          {visibleEdges.map((e, i) => {
            const a = positionFor(e.source)
            const b = positionFor(e.target)
            if (!a || !b) return null
            const inChain = chainIds && chainIds.has(e.source) && chainIds.has(e.target)
            const touchesHover = hoveredId && (e.source === hoveredId || e.target === hoveredId)
            const lit = inChain || (!selectedId && touchesHover)
            const cls =
              e.type === "related" ? "edge related" : "edge prereq"
            return (
              <path
                key={`${e.source}->${e.target}`}
                className={`${cls}${lit ? " lit" : ""}${inChain ? " flow" : ""}`}
                d={edgePath(a, b, i)}
                fill="none"
              />
            )
          })}
        </svg>

        {concepts.map((concept, index) => {
          const isSelected = concept.id === selectedId
          const inChain = chainIds && chainIds.has(concept.id)
          return (
            <GraphNode
              key={concept.id}
              concept={concept}
              pos={positionFor(concept.id)}
              order={index}
              selected={isSelected}
              highlighted={Boolean(chainIds) && inChain && !isSelected}
              dimmed={Boolean(chainIds) && !inChain}
              onSelect={() => onSelect(concept.id)}
              onHover={() => onHover(concept.id)}
              onLeave={() => onHover(null)}
            />
          )
        })}
      </div>

      {/* zoom HUD */}
      <div className="zoom-hud" aria-hidden="true">
        <span className="zoom-pct">{Math.round(view.s * 100)}%</span>
        <span className="zoom-hint">drag to pan · scroll to zoom · double-click to fit</span>
      </div>

      {hoveredConcept && <GraphTooltip concept={hoveredConcept} view={view} />}
    </div>
  )
}

function GraphNode({ concept, pos, order, selected, highlighted, dimmed, onSelect, onHover, onLeave }) {
  const cls = ["g-node", selected && "selected", highlighted && "highlighted", dimmed && "dim"]
    .filter(Boolean)
    .join(" ")

  return (
    <button
      type="button"
      className={cls}
      style={{
        left: pos.x,
        top: pos.y,
        width: NODE_W,
        height: NODE_H,
        "--i": order % 14,
      }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
      aria-pressed={selected}
      aria-label={`${concept.name} — ${subjectOf(concept.subject)}, Semester ${concept.semester}, retention ${concept.retention}%`}
    >
      <span className="node-dot" style={{ background: dotColor(concept.status) }} />
      <span className="node-body">
        <span className="node-title">{concept.name}</span>
        <span className="node-meta">
          {subjectOf(concept.subject)} · {concept.retention}%
        </span>
      </span>
    </button>
  )
}

function GraphTooltip({ concept, view }) {
  const pos = positionFor(concept.id)
  const left = (pos.x + NODE_W / 2) * view.s + view.tx
  const top = pos.y * view.s + view.ty - 10
  return (
    <div className="graph-tooltip" style={{ left, top }} role="tooltip">
      <span className="tt-name">{concept.name}</span>
      <span className="tt-sub">
        SEM {concept.semester} · {subjectOf(concept.subject)}
      </span>
    </div>
  )
}
