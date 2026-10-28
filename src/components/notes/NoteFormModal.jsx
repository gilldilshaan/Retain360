import React, { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import Modal from "./Modal.jsx"
import Input from "../form/Input.jsx"
import Select from "../form/Select.jsx"
import TextArea from "../form/TextArea.jsx"
import { SUBJECTS, SEMESTERS } from "../../data/noteLibrary.js"
import { ACCEPT, detectType, validateFile, formatSize } from "../../utils/fileStore.js"

// The same form is used for BOTH adding and editing a note.
//   note = null      -> "Add" mode (empty form)
//   note = {...}     -> "Edit" mode (form is pre-filled)

// "All" is only for the filter bar, so we remove it from the form options
const subjectOptions = SUBJECTS.filter((s) => s !== "All").map((s) => ({ value: s, label: s }))
const semesterOptions = SEMESTERS.filter((s) => s !== "All").map((s) => ({ value: s, label: `Semester ${s}` }))

const EMPTY_FORM = { title: "", subject: "", semester: "", tags: "", preview: "", content: "" }

// "a, b, c"  ->  ["a", "b", "c"]
function splitTags(text) {
  return text
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag !== "")
}

export default function NoteFormModal({ note, onSave, onClose }) {
  // if we are editing, start with the note's values (everything is text inside a form)
  const [form, setForm] = useState(
    note
      ? {
          title: note.title,
          subject: note.subject,
          semester: String(note.semester),
          tags: note.tags.join(", "),
          preview: note.preview,
          content: note.content || "",
        }
      : EMPTY_FORM
  )
  const [errors, setErrors] = useState({})

  // ── file upload state ──
  const [file, setFile] = useState(null) // a NEW file chosen in this form
  const [removeOld, setRemoveOld] = useState(false) // editing: user removed the existing file
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef(null)

  // the file to show in the form: the new one, or the note's existing one
  const shownFile = file
    ? { name: file.name, size: file.size }
    : note?.attachment && !removeOld
    ? note.attachment
    : null

  const chooseFile = (chosen) => {
    if (!chosen) return
    const problem = validateFile(chosen)
    setErrors({ ...errors, file: problem })
    if (!problem) setFile(chosen)
  }

  const clearFile = () => {
    if (file) setFile(null) // drop the newly chosen file
    else setRemoveOld(true) // or remove the file the note already had
    setErrors({ ...errors, file: "" })
  }

  // useRef: lets us touch the real input element, here to focus it automatically
  const titleRef = useRef(null)
  useEffect(() => {
    titleRef.current.focus()
  }, [])

  // one function handles every field, using the field's "name"
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    setErrors({ ...errors, [name]: "" }) // clear that field's error while typing
  }

  // check every field and collect error messages
  const validate = () => {
    const newErrors = {}

    // Title: required (shared validator) + minLength 3 (shared validator)
    if (required(form.title)) newErrors.title = required(form.title)
    else newErrors.title = minLength(3)(form.title)

    // Subject: must choose
    if (form.subject === "") newErrors.subject = "Please choose a subject"
    if (form.semester === "") newErrors.semester = "Please choose a semester"

    // Preview: at least 10 characters
    if (form.preview.trim().length < 10) {
      newErrors.preview = "Write a short summary (at least 10 characters)"
    }

    // Tags: max 5
    if (splitTags(form.tags).length > 5) {
      newErrors.tags = "You can add a maximum of 5 tags"
    }

    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault() // stop the page from reloading

    const foundErrors = validate()
    setErrors(foundErrors)

    // if there is any error, stop here and do not save
    if (Object.keys(foundErrors).length > 0) return

    // everything is valid -> send clean data to the parent
    const data = {
      title: form.title.trim(),
      subject: form.subject,
      semester: Number(form.semester),
      tags: splitTags(form.tags),
      preview: form.preview.trim(),
    }

    // what happened to the file? (undefined = nothing changed)
    let fileChange
    if (file) {
      data.type = detectType(file) // PDF / PPT / DOCX / IMG, detected from the extension
      data.attachment = { name: file.name, size: file.size }
      fileChange = { file }
    } else if (removeOld) {
      data.type = "NOTE" // back to a plain written note
      data.attachment = null
      fileChange = { remove: true }
    }

    // The note text is written here only when ADDING a new note.
    // When editing, the text is changed on the note page (auto-save editor),
    // so we do not touch it here.
    if (!note) {
      data.content = form.content.trim()
    }

    onSave(data, fileChange)
  }

  return (
    <Modal title={note ? "Edit note" : "Add a new note"} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          error={errors.title}
          placeholder="e.g. Matrix Multiplication"
          inputRef={titleRef}
        />

        <div className="nf-row">
          <Select
            label="Subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            options={subjectOptions}
            error={errors.subject}
            placeholder="Choose subject"
          />

          <Select
            label="Semester"
            name="semester"
            value={form.semester}
            onChange={handleChange}
            options={semesterOptions}
            error={errors.semester}
            placeholder="Choose semester"
          />
        </div>

        <div className="nf-row">
          <Input
            label="Tags (comma separated)"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            error={errors.tags}
            placeholder="matrices, algebra"
          />
        </div>

        {/* optional real file: PDF, PPT, DOCX or image */}
        <div className="nf-field">
          <label className="nf-label">Attach a file (optional)</label>

          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPT}
            className="nf-file-input"
            onChange={(e) => {
              chooseFile(e.target.files[0])
              e.target.value = "" // lets the user pick the same file again
            }}
          />

          {shownFile ? (
            <div className="nf-file-chip">
              <span>
                {shownFile.name} <em>· {formatSize(shownFile.size)}</em>
              </span>
              <div className="nf-file-actions">
                <button type="button" onClick={() => fileInputRef.current.click()}>
                  Replace
                </button>
                <button type="button" aria-label="Remove file" onClick={clearFile}>
                  <X size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`nf-drop ${dragging ? "dragging" : ""} ${errors.file ? "has-error" : ""}`}
              onClick={() => fileInputRef.current.click()}
              onDragOver={(e) => {
                e.preventDefault()
                setDragging(true)
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragging(false)
                chooseFile(e.dataTransfer.files[0])
              }}
            >
              <strong>Choose a file or drag it here</strong>
              <small>PDF, PPT, DOCX or image · max 10 MB</small>
            </div>
          )}

          {errors.file && <p className="nf-error">{errors.file}</p>}
        </div>

        <TextArea
          label="Short summary"
          name="preview"
          value={form.preview}
          onChange={handleChange}
          error={errors.preview}
          placeholder="What is this note about?"
          rows={3}
        />

        {/* the actual note text: only shown when adding a new note */}
        {!note && (
          <TextArea
            label="Note content (optional, you can also write it later)"
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Write your notes here…"
            rows={7}
          />
        )}

        <div className="nf-actions">
          <button type="button" className="nl-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="nl-btn primary">
            {note ? "Save changes" : "Add note"}
          </button>
        </div>
      </form>
    </Modal>
  )
}
