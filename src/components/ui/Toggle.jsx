import React from "react"

export default function Toggle({ checked, label, onChange }) {
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