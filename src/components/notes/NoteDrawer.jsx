import React from "react"
import { X, Pin, PinOff, Link2 } from "lucide-react"
import FileTypeIcon from "./FileTypeIcon.jsx"

export default function NoteDrawer({ note, relatedNotes, isPinned, onClose, onPin, onOpen, onRelatedClick }) {
  if (!note) return null

  return (
    <div className="overlay" onClick={onClose}>
      <div className="drawer" role="dialog" aria-label={note.title} onClick={(e) => e.stopPropagation()}>
        <button className="drawer-close" aria-label="Close" onClick={onClose}>
          <X size={18} />
        </button>

        <span className="type-badge drawer-badge" title={note.type}>
          <FileTypeIcon type={note.type} size={16} />
        </span>

        <h2 className="drawer-title">{note.title}</h2>

        <div className="drawer-meta">
          {note.subject} · Semester {note.semester} {" · "}Updated {note.updated}
        </div>

        <p className="drawer-preview">{note.preview}</p>

        <div className="tag-row">
          {note.tags.map((tag) => (
            <span key={tag} className="tag">
              #{tag}{" "}
            </span>
          ))}
        </div>

        <div className="drawer-actions">
          <button
            className={`pin-drawer-btn ${isPinned ? "active" : ""}`}
            onClick={() => onPin(note.id)}
          >
            {isPinned ? (
              <>
                <PinOff size={14} />
                Unpin
              </>
            ) : (
              <>
                <Pin size={14} />
                Pin note
              </>
            )}
          </button>

          <button className="open-btn-large" onClick={() => onOpen(note)}>
            Open note
          </button>
        </div>

        {relatedNotes.length > 0 && (
          <div className="related-block">
            <div className="related-heading">
              <Link2 size={13} />
              Related topics
            </div>

            <div className="related-list">
              {relatedNotes.map((related) => (
                <button key={related.id} className="related-chip" onClick={() => onRelatedClick(related.id)}>
                  <span className="related-dot" />
                  {related.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}