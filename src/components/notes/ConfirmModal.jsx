import React from "react"
import Modal from "./Modal.jsx"

// "Are you sure?" popup shown before deleting a note
export default function ConfirmModal({ note, onConfirm, onCancel }) {
  return (
    <Modal title="Delete this note?" onClose={onCancel}>
      <p className="nl-modal-text">
        <strong>{note.title}</strong> will be removed permanently. This cannot be undone.
      </p>

      <div className="nf-actions">
        <button className="nl-btn" onClick={onCancel}>
          Cancel
        </button>
        <button className="nl-btn danger" onClick={onConfirm}>
          Yes, delete
        </button>
      </div>
    </Modal>
  )
}
