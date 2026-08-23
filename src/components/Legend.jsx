import React from "react"

// Small key so the graph reads without explanation.
export default function Legend() {
  return (
    <div className="legend" aria-label="Graph legend">
      <div className="legend-row">
        <span className="legend-dot strong" /> Strong
        <span className="legend-dot normal" /> Familiar
        <span className="legend-dot fading" /> Fading
      </div>
      <div className="legend-row">
        <svg width="20" height="8" aria-hidden="true">
          <line x1="0" y1="4" x2="20" y2="4" stroke="#5f6750" strokeWidth="1.6" />
        </svg>
        Prerequisite
        <svg width="20" height="8" aria-hidden="true">
          <line x1="0" y1="4" x2="20" y2="4" stroke="#798165" strokeWidth="1.6" strokeDasharray="4 3" />
        </svg>
        Related
      </div>
    </div>
  )
}