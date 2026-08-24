import React from "react"

export default function GraphHealth({ conceptsLive }) {
  const total = conceptsLive.length
  const avg = Math.round(conceptsLive.reduce((s, c) => s + c.retention, 0) / total)
  const strong = conceptsLive.filter((c) => c.retention >= 75).length
  const steady = conceptsLive.filter((c) => c.retention >= 55 && c.retention < 75).length
  const fading = conceptsLive.filter((c) => c.retention < 55).length

  const pct = (n) => ((n / total) * 100).toFixed(0)

  return (
    <div className="graph-health" aria-label="Knowledge health summary">
      <span className="micro">Knowledge Health</span>
      <span className="gh-avg serif">{avg}%</span>
      <span className="gh-sub">avg across {total} concepts</span>

      <div className="gh-bar" role="img" aria-label={`Health distribution: ${strong} strong, ${steady} steady, ${fading} fading`}>
        <span className="gh-segment gh-strong" title={`${strong} Strong`} />
        <span className="gh-segment gh-steady" title={`${steady} Steady`} />
        <span className="gh-segment gh-fading" title={`${fading} Fading`} />
      </div>

      <div className="gh-legend">
        <span>
          <i className="gh-key gh-strong" />
          {strong} Strong
        </span>
        <span>
          <i className="gh-key gh-steady" />
          {steady} Steady
        </span>
        <span>
          <i className="gh-key gh-fading" />
          {fading} Fading
        </span>
      </div>
    </div>
  )
}