import React from "react"

// Reusable dropdown. "options" is a list like [{ value: 1, label: "Semester 1" }]
export default function Select({ label, name, value, onChange, options, error, placeholder }) {
  return (
    <div className="nf-field">
      <label htmlFor={name} className="nf-label">
        {label}
      </label>

      <select
        id={name}
        name={name}
        className={`nf-control ${error ? "has-error" : ""}`}
        value={value}
        onChange={onChange}
      >
        {placeholder && <option value="">{placeholder}</option>}

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="nf-error">{error}</p>}
    </div>
  )
}
