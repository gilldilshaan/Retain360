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

  const zoomAroundCenter = useCallback((factor) => {
    const el = areaRef.current
    const cx = (el?.clientWidth || 900) / 2
    const cy = (el?.clientHeight || 640) / 2
    setView((prev) => {
      const next = Math.min(2.6, Math.max(0.22, prev.s * factor))
      if (next === prev.s) return prev
      const wx = (cx - prev.tx) / prev.s
      const wy = (cy - prev.ty) / prev.s
      return { s: next, tx: cx - wx * next, ty: cy - wy * next }
    })
  }, [])

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

  // Expose imperative controls to the toolbar via a ref.
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

  // When a node is selected, highlight its whole knowledge chain —
  // prerequisites of prerequisites and concepts that use it later.
  const chainIds = selectedId ? relatedChainIds(selectedId) : null

  const visibleEdges = connections.filter((e) => {
    if (e.type === "prerequisite") return showPrerequisites
    if (e.type === "used in") return showRelated
    return true
  })

  const hoveredConcept = hoveredId ? concepts.find((c) => c.id === hoveredId) : null

  return (
    <div className="graph-area" ref={areaRef}>
      <div
        className="graph-canvas"
        role="application"
        aria-label="Knowledge graph"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClear?.()
        }}
        onWheel={(e) => zoomAroundCenter(e.deltaY < 0 ? 1.1 : 1 / 1.1)}
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

          {visibleEdges.map((e) => {
            const a = positionFor(e.source)
            const b = positionFor(e.target)
            if (!a || !b) return null
            const inChain = chainIds && chainIds.has(e.source) && chainIds.has(e.target)
            return (
              <line
                key={`${e.source}->${e.target}`}
                x1={a.x + NODE_W / 2}
                y1={a.y + NODE_H / 2}
                x2={b.x + NODE_W / 2}
                y2={b.y + NODE_H / 2}
                stroke={inChain ? "#5f6750" : "#798165"}
                strokeWidth={inChain ? 1.9 : 1}
                strokeDasharray={e.type === "related" ? "4 4" : undefined}
                opacity={chainIds ? (inChain ? 0.95 : 0.12) : e.type === "related" ? 0.3 : 0.45}
                strokeLinecap="round"
              />
            )
          })}
        </svg>

        {concepts.map((concept) => {
          const isSelected = concept.id === selectedId
          const inChain = chainIds && chainIds.has(concept.id)
          return (
            <GraphNode
              key={concept.id}
              concept={concept}
              pos={positionFor(concept.id)}
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

      {hoveredConcept && <GraphTooltip concept={hoveredConcept} view={view} />}
    </div>
  )
}

function GraphNode({ concept, pos, selected, highlighted, dimmed, onSelect, onHover, onLeave }) {
  const cls = [
    "g-node",
    selected && "selected",
    highlighted && "highlighted",
    dimmed && "dim",
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <button
      type="button"
      className={cls}
      style={{ left: pos.x, top: pos.y, width: NODE_W, height: NODE_H }}
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
