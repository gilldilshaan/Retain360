import React from "react"

const statusWord = (v) => (v >= 75 ? "Strong" : v >= 55 ? "Steady" : "Fading")

export default function RetentionIndicator({ value }) {
  const blocks = 10
  const filled = Math.round((value / 100) * blocks)
  return (
    <div className="retention">
      <div className="retention-head">
        <span className="micro">Knowledge Strength</span>
        <span className="retention-value">{value}%</span>
      </div>
      <div
        className="retention-track"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-label={`Knowledge strength ${value}%`}
      >
        {Array.from({ length: blocks }, (_, i) => (
          <span key={i} className={`retention-block${i < filled ? " filled" : ""}`} />
        ))}
      </div>
      <span className="retention-word">{statusWord(value)}</span>
    </div>
  )
}