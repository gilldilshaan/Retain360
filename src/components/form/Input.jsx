import React from "react"

// Reusable text input: label + input + error message.
// Used for every single-line field in the app, so we write it only once.
export default function Input({ label, name, value, onChange, error, placeholder, inputRef }) {
  return (
    <div className="nf-field">
      <label htmlFor={name} className="nf-label">
        {label}
      </label>

      <input
        id={name}
        name={name}
        ref={inputRef}
        type="text"
        className={`nf-control ${error ? "has-error" : ""}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />

      {error && <p className="nf-error">{error}</p>}
    </div>
  )
}
