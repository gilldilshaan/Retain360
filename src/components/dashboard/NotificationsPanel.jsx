import React, { useEffect } from "react"
import { CloseIcon } from "../Icons.jsx"
import { notes } from "../../data/notes.js"

// Frontend-mock notifications derived from existing static data only.
export function buildNotifications(conceptsLive) {
  const fading = conceptsLive
    .filter((c) => c.status === "fading")
    .sort((a, b) => a.retention - b.retention)
    .slice(0, 3)
    .map((c) => ({
      id: `n-${c.id}`,
      tone: "warn",
      title: `${c.name} is fading`,
      body: `Retention dropped to ${c.retention}%. A quick refresh would help.`,
      when: "This week",
    }))

  return [
    ...fading,
    {
      id: "n-library",
      tone: "info",
      title: "Notes worth revisiting",
      body: `You have ${notes.length} notes in your library tied to concepts on the map.`,
      when: "Earlier",
    },
  ]
}

export default function NotificationsPanel({ open, onClose, notifications }) {
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
      <div className="popover notif-popover" role="dialog" aria-label="Notifications">
        <div className="popover-head">
          <span className="micro">
            Notifications {notifications.length > 0 && `· ${notifications.length}`}
          </span>
          <button type="button" className="popover-close" onClick={onClose} aria-label="Close notifications">
            <CloseIcon width={14} height={14} />
          </button>
        </div>

        {notifications.length === 0 ? (
          <p className="notif-empty">You&rsquo;re all caught up.</p>
        ) : (
          <ul className="notif-list">
            {notifications.map((n) => (
              <li key={n.id} className={`notif-item${n.tone === "warn" ? " warn" : ""}`}>
                <span className="notif-dot" aria-hidden="true" />
                <span className="notif-copy">
                  <span className="notif-title">{n.title}</span>
                  <span className="notif-body">{n.body}</span>
                </span>
                <span className="notif-when">{n.when}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
