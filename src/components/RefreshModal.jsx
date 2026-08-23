import React, { useEffect } from "react"
import { CloseIcon } from "./Icons.jsx"
import { subjectOf } from "../data/subjects.js"

export default function RefreshModal({ concept, retention, onClose, onReviewed }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  if (!concept) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Quick refresh — ${concept.name}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <CloseIcon />
        </button>

        <span className="micro">2-Minute Refresh</span>
        <h3 className="modal-title serif">{concept.name}</h3>
        <p className="modal-desc">{concept.description}</p>

        {concept.id === "matrix-multiplication" && (
          <div className="modal-example" aria-label="Worked example">
            <pre className="matrix">{`[ 1  2 ]   [ 5  6 ]
[ 3  4 ] × [ 7  8 ]`}</pre>
            <span className="matrix-arrow" aria-hidden="true">↓</span>
            <pre className="matrix result">{`[ 19  22 ]
[ 43  50 ]`}</pre>
          </div>
        )}

        <div className="modal-foot">
          <span className="modal-meta">
            {subjectOf(concept.subject)} · SEM {concept.semester} · now {retention}%
          </span>
          <button type="button" className="btn btn-primary" onClick={() => onReviewed(concept.id)}>
            Mark as Reviewed
          </button>
        </div>
      </div>
    </div>
  )
}