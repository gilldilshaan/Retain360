import React from "react"
import { ZoomInIcon, ZoomOutIcon, FitIcon, ResetIcon, ChevronIcon } from "./Icons.jsx"
import { semesters, subjects } from "../data/subjects.js"

export default function GraphToolbar({
  semester,
  subject,
  onSemester,
  onSubject,
  showPrerequisites,
  showRelated,
  onTogglePrerequisites,
  onToggleRelated,
  onZoomIn,
  onZoomOut,
  onFit,
  onReset,
  conceptCount,
  connectionCount,
}) {
  return (
    <div className="graph-toolbar">
      <div className="toolbar-left">
        <Select
          label="All Semesters"
          value={semester}
          options={semesters.map((s) => ({ value: s.id, label: `${s.label} · ${s.name}` }))}
          onChange={onSemester}
        />
        <Select
          label="All Subjects"
          value={subject}
          options={subjects.map((s) => ({ value: s.id, label: s.name }))}
          onChange={onSubject}
        />
        <Toggle checked={showPrerequisites} label="Prerequisites" onChange={onTogglePrerequisites} />
        <Toggle checked={showRelated} label="Related" onChange={onToggleRelated} />
      </div>

      <div className="toolbar-right">
        <span className="toolbar-meta">
          {conceptCount} concepts · {connectionCount} connections
        </span>
        <button className="tool-btn" onClick={onZoomIn} aria-label="Zoom in">
          <ZoomInIcon />
        </button>
        <button className="tool-btn" onClick={onZoomOut} aria-label="Zoom out">
          <ZoomOutIcon />
        </button>
        <button className="tool-btn" onClick={onFit} aria-label="Fit graph to view">
          <FitIcon />
        </button>
        <button className="tool-btn" onClick={onReset} aria-label="Reset view">
          <ResetIcon />
        </button>
      </div>
    </div>
  )
}

function Select({ label, value, options, onChange }) {
  return (
    <label className="select-wrap">
      <select
        className="tool-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
      >
        <option value="all">{label}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronIcon width={14} height={14} />
    </label>
  )
}

function Toggle({ checked, label, onChange }) {
  return (
    <button
      className={`tool-toggle${checked ? " on" : ""}`}
      role="switch"
      aria-checked={checked}
      aria-label={`${label}: ${checked ? "on" : "off"}`}
      onClick={() => onChange(!checked)}
    >
      <span className="toggle-track">
        <span className="toggle-thumb" />
      </span>
      <span>{label}</span>
    </button>
  )
}