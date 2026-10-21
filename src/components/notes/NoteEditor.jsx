import React, { useState } from "react"

// The writing area of a note. The text is saved automatically
// on every change (no Save button needed).
//   note   -> the note we are writing in
//   onSave -> function that receives the new text and stores it
export default function NoteEditor({ note, onSave }) {
  const [text, setText] = useState(note.content || "")
  const [saved, setSaved] = useState(false)

  const handleChange = (e) => {
    const value = e.target.value
    setText(value)
    onSave(value)
    setSaved(true)
  }

  // count words: split on spaces, ignore an empty note
  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length

  const status = saved ? "Saved ✓" : ""

  return (
    <div className="nd-editor">
      <div className="nd-editor-head">
        <span className="nd-editor-title">Your notes</span>
        <span className="nd-editor-info">
          {wordCount} words {status && `· ${status}`}
        </span>
      </div>

      <textarea
        className="nd-editor-area"
        value={text}
        onChange={handleChange}
        placeholder="Start writing your notes here… (it saves automatically)"
      />
    </div>
  )
}
