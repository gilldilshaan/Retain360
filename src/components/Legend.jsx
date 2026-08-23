import React from "react"

export default function Legend({ showPrerequisites, showRelated }) {
  return (
    <div className="legend" aria-label="Legend">
      <div className="legend-row">
        <span className="legend-dot strong" /> Strong
        <span className="legend-dot normal" /> Steady
        <span className="legend-dot fading" /> Fading
      </div>
      <div className="legend-row legend-edges">
        <span className="legend-line" /> Prerequisite
        <span className={`legend-line thin${showRelated ? "" : " off"}`} /> Related / used in
        {!showPrerequisites && <span className="legend-note">prereq edges hidden</span>}
      </div>
    </div>
  )
}