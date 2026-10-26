import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { profile } from "../../data/profile.js"

export default function ProfileMenu({ open, onClose }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      <div className="popover-backdrop" onClick={onClose} />
      <div className="popover profile-popover" role="dialog" aria-label="Account menu">
        <div className="pm-user">
          <span className="pm-avatar" aria-hidden="true">
            {profile.initials}
          </span>
          <span>
            <span className="pm-name serif">{profile.name}</span>
            <span className="pm-sub">{profile.degree}</span>
          </span>
        </div>

        <div className="pm-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              onClose()
              navigate("/profile")
            }}
          >
            View Profile
          </button>
          <button
            type="button"
            className="btn btn-quiet"
            onClick={() => {
              onClose()
              navigate("/notes")
            }}
          >
            Search Notes
          </button>
        </div>
      </div>
    </>
  )
}
