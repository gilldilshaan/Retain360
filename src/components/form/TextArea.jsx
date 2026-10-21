import React from "react"

// Reusable multi-line input (same idea as Input.jsx)
export default function TextArea({ label, name, value, onChange, error, placeholder, rows = 4 }) {
  return (
    <div className="nf-field">
      <label htmlFor={name} className="nf-label">
        {label}
      </label>

      <textarea
        id={name}
        name={name}
        rows={rows}
        className={`nf-control ${error ? "has-error" : ""}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />

      {error && <p className="nf-error">{error}</p>}
    </div>
  )
}
