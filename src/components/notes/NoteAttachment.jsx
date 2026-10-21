import React, { useState, useEffect } from "react"
import { Download, Paperclip } from "lucide-react"
import { loadFile, formatSize } from "../../utils/fileStore.js"

// Shows the uploaded file of a note: name, size, Download button,
// and an inline preview for PDFs and images.
export default function NoteAttachment({ note }) {
  const [url, setUrl] = useState(null)
  const [status, setStatus] = useState("loading") // loading | ready | missing

  useEffect(() => {
    let objectUrl = null
    let cancelled = false

    loadFile(note.id)
      .then((file) => {
        if (cancelled) return
        if (!file) {
          setStatus("missing")
          return
        }
        objectUrl = URL.createObjectURL(file) // a temporary link to the file
        setUrl(objectUrl)
        setStatus("ready")
      })
      .catch(() => !cancelled && setStatus("missing"))

    // free the temporary link when we leave the page
    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [note.id])

  const { name, size } = note.attachment

  return (
    <div className="nd-attach">
      <div className="nd-attach-head">
        <span className="nd-attach-name">
          <Paperclip size={14} /> {name} <em>· {formatSize(size)}</em>
        </span>

        {status === "ready" && (
          <a className="nl-btn" href={url} download={name}>
            <Download size={14} /> Download
          </a>
        )}
      </div>

      {status === "loading" && <p className="nd-attach-msg">Loading file…</p>}
      {status === "missing" && (
        <p className="nd-attach-msg">The file was not found in this browser. Files are stored only on the device where they were added.</p>
      )}

      {status === "ready" && note.type === "PDF" && <iframe className="nd-attach-pdf" src={url} title={name} />}
      {status === "ready" && note.type === "IMG" && <img className="nd-attach-img" src={url} alt={name} />}
      {status === "ready" && (note.type === "PPT" || note.type === "DOCX") && (
        <p className="nd-attach-msg">Preview is not available for this file type. Use Download to open it.</p>
      )}
    </div>
  )
}
