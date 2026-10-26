import React, { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ArrowLeft, Pin, PinOff, Pencil, Trash2, Link2 } from "lucide-react"

import FileTypeIcon from "./notes/FileTypeIcon.jsx"
import NoteFormModal from "./notes/NoteFormModal.jsx"
import NoteEditor from "./notes/NoteEditor.jsx"
import NoteAttachment from "./notes/NoteAttachment.jsx"
import ConfirmModal from "./notes/ConfirmModal.jsx"
import { useNotes } from "../store/useNotes.js"
import { useToast } from "../context/ToastContext.jsx"

// Page for ONE note, shown at the URL /notes/:noteId  (a dynamic route).
// Example: /notes/3 -> useParams() gives us noteId = "3"
export default function NoteDetailPage() {
  const { noteId } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { getNoteById, getRelatedNotes, pinnedIds, togglePin, updateNote, deleteNote } = useNotes()

  const [editing, setEditing] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  // URL params are always text, so we convert to a number to match our ids
  const note = getNoteById(Number(noteId))

  // ── 404 for notes: this id does not exist ──
  if (!note) {
    return (
      <div className="note-detail">
        <div className="nd-card nd-notfound">
          <h2>Note not found</h2>
          <p>There is no note with the id "{noteId}". It may have been deleted.</p>
          <Link to="/notes" className="nl-btn primary">
            Back to My Notes
          </Link>
        </div>
      </div>
    )
  }

  const isPinned = pinnedIds.includes(note.id)
  const relatedNotes = getRelatedNotes(note)

  const handleSave = (data, fileChange) => {
    updateNote(note.id, data, fileChange)
    showToast("Note updated")
    setEditing(false)
  }

  const handleDelete = () => {
    deleteNote(note.id)
    showToast("Note deleted")
    navigate("/notes") // the note is gone, so go back to the list
  }

  return (
    <div className="note-detail">
      <Link to="/notes" className="nd-back">
        <ArrowLeft size={15} /> Back to My Notes
      </Link>

      <div className="nd-card">
        <span className="type-badge nd-badge" title={note.type}>
          <FileTypeIcon type={note.type} size={18} />
        </span>

        <h1 className="nd-title">{note.title}</h1>

        <div className="nd-meta">
          {note.subject} · Semester {note.semester} · {note.type} · Updated {note.updated}
        </div>

        <div className="nd-summary-label">Summary</div>
        <p className="nd-summary">{note.preview}</p>

        {note.tags.length > 0 && (
          <div className="nd-tags">
            {note.tags.map((tag) => (
              <span key={tag} className="nd-tag">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="nd-actions">
          <button className="nl-btn" onClick={() => togglePin(note.id)}>
            {isPinned ? <PinOff size={14} /> : <Pin size={14} />}
            {isPinned ? "Unpin" : "Pin"}
          </button>
          <button className="nl-btn" onClick={() => setEditing(true)}>
            <Pencil size={14} /> Edit
          </button>
          <button className="nl-btn danger" onClick={() => setConfirmingDelete(true)}>
            <Trash2 size={14} /> Delete
          </button>
        </div>

        {/* the uploaded file (only if this note has one) */}
        {note.attachment && <NoteAttachment key={note.id + note.attachment.name} note={note} />}

        {/* key={note.id} makes React create a fresh editor when we move to another note */}
        <NoteEditor key={note.id} note={note} onSave={(content) => updateNote(note.id, { content })} />

        {relatedNotes.length > 0 && (
          <div className="nd-related">
            <div className="nd-related-title">
              <Link2 size={13} /> Related topics
            </div>
            <div className="nd-related-list">
              {relatedNotes.map((related) => (
                <Link key={related.id} to={`/notes/${related.id}`} className="nd-related-chip">
                  {related.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {editing && <NoteFormModal note={note} onSave={handleSave} onClose={() => setEditing(false)} />}

      {confirmingDelete && (
        <ConfirmModal note={note} onConfirm={handleDelete} onCancel={() => setConfirmingDelete(false)} />
      )}
    </div>
  )
}
