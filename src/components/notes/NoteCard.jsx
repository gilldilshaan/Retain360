import React from "react"
import { Pin } from "lucide-react"
import FileTypeIcon from "./FileTypeIcon.jsx"
import { SUBJECT_COLORS } from "../../data/noteLibrary.js"

export default function NoteCard({ note, isPinned, onPin, onOpen, sizeClass, colorVariant }) {
  return (
    <div
      className={`note-card ${sizeClass} ${colorVariant}`}
      style={{
        "--subject-color": SUBJECT_COLORS[note.subject] || "#798165",
      }}
      onClick={() => onOpen(note)}
    >
      <div className="card-top-row">
        <span className="type-badge" title={note.type}>
          <FileTypeIcon type={note.type} />
        </span>

        <button
          className="pin-btn"
          aria-label={isPinned ? "Unpin note" : "Pin note"}
          onClick={(e) => {
            e.stopPropagation()
            onPin(note.id)
          }}
        >
          {isPinned ? <Pin size={20} fill="currentColor" /> : <Pin size={16} />}
        </button>
      </div>

      <h3 className="card-title">{note.title}</h3>

      <div className="card-meta">
        {note.subject} · Semester {note.semester}
      </div>

      <p className="card-preview">{note.preview}</p>

      <div className="card-footer">
        <span className="card-updated">{note.updated}</span>

        <button
          className="open-btn"
          onClick={(e) => {
            e.stopPropagation()
            onOpen(note)
          }}
        >
          Open note
        </button>
      </div>
    </div>
  )
}