import React, { useRef, useState, useEffect } from "react"
import { ChevronDownIcon } from "../Icons.jsx"

export default function Dropdown({ label, options, value, onSelect, placeholder }) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)
  const selectRef = useRef(null)

  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.key === "Escape") {
        setOpen(false)
        if (selectRef.current) selectRef.current.focus()
      }
    }
    document.addEventListener("keydown", handleKeydown)
    return () => document.removeEventListener("keydown", handleKeydown)
  }, [open])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  return (
    <div className="dropdown-wrapper" ref={dropdownRef}>
      <div className="dropdown-trigger" onClick={() => setOpen(!open)} aria-label={label}>
        <span className="dropdown-label">{label}</span>
        <span className="dropdown-value">{value || (placeholder || "Select")}</span>
        <ChevronDownIcon width={14} height={14} className="dropdown-arrow" />
      </div>

      {open && (
        <div className="dropdown-menu" role="menu" aria-label={label}>
          {options.map((option) => (
            <div
              key={option.value}
              role="menuitem"
              className="dropdown-item"
              onClick={() => {
                onSelect(option.value)
                setOpen(false)
              }}
            >
              {option.label}
            </div>
          ))}
          {options.length === 0 && (
            <div className="dropdown-item dropdown-empty">
              No options available
            </div>
          )}
        </div>
      )}
    </div>
  )
}