import React, { useState } from "react"
import RegistrationForm from "../form/RegistrationForm.jsx"
import Modal from "../ui/Modal.jsx"

export default function RegistrationPage({ onClose, onRecordAdd, showToast }) {
  const [records, setRecords] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  // Lifecycle hook from the original implementation to close modal on navigation
  // This mimics the previous KnowledgeMapPage behavior where registration was modal-only
  return (
    <div className="registration-page">
      <h2 className="page-title">Registration Demo</h2>
      <p className="empty-state">
        The registration feature has been removed. This page is kept for historical reference.
      </p>
      <button type="button" className="btn btn-outline" onClick={onClose}>
        Close
      </button>
    </div>
  )
}