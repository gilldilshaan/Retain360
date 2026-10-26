import React, { useEffect, useRef, useState } from "react"
import { CloseIcon } from "../Icons.jsx"

export default function Modal({ title, children, onClose, okLabel = "OK", cancelLabel = "Cancel", onOk }) {
  const [open, setOpen] = useState(true)
  const modalRef = useRef(null)

  // Keep internal open state in sync with prop onClose if onClose is used as a callback from parent
  React.useEffect(() => {
    if (!open) return

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]

    const handleKeydown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose?.()
        setOpen(false)
      }
    }

    const handleOutsideClick = (e) => {
      if (e.target === e.currentTarget) {
        onClose?.()
        setOpen(false)
      }
    }

    modalRef.current.addEventListener("keydown", handleKeydown)
    modalRef.current.addEventListener("click", handleOutsideClick)

    if (firstElement) firstElement.focus()

    return () => {
      modalRef.current.removeEventListener("keydown", handleKeydown)
      modalRef.current.removeEventListener("click", handleOutsideClick)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal-backdrop" ref={modalRef} aria-modal="true" role="dialog" aria-labelledby="modal-title">
      <div className="modal-container" role="document">
        <button
          type="button"
          className="modal-close-btn"
          aria-label="Close modal"
          onClick={() => {
            setOpen(false)
            onClose?.()
          }}
        >
          <CloseIcon width={24} height={24} />
        </button>

        <h2 id="modal-title" className="modal-title">
          {title}
        </h2>

        <div className="modal-content">{children}</div>

        <div className="modal-actions">
          {onOk !== undefined ? (
            <>
              <button
                type="button"
                className="modal-cancel-btn"
                onClick={() => {
                  onClose?.()
                  setOpen(false)
                }}
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                className="modal-ok-btn"
                onClick={() => {
                  onOk()
                  setOpen(false)
                }}
              >
                {okLabel}
              </button>
            </>
          ) : (
            <button
              type="button"
              className="modal-ok-btn"
              onClick={() => {
                setOpen(false)
                onClose?.()
              }}
            >
              {okLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}