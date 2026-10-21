import React, { useEffect } from "react"
import { X } from "lucide-react"

// Reusable modal (popup). Whatever we put between <Modal> ... </Modal>
// is shown inside it (that is what "children" means).
// Used for: the add/edit form and the delete confirmation.
export default function Modal({ title, onClose, children }) {
  // close the modal when the Escape key is pressed
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)

    // cleanup: remove the listener when the modal closes
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose])

  return (
    // clicking the dark background closes the modal
    <div className="nl-modal-backdrop" onClick={onClose}>
      {/* stopPropagation so clicking INSIDE the modal does not close it */}
      <div className="nl-modal" role="dialog" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <button className="nl-modal-close" aria-label="Close" onClick={onClose}>
          <X size={18} />
        </button>

        <h2 className="nl-modal-title">{title}</h2>

        {children}
      </div>
    </div>
  )
}
