import React, { createContext, useContext, useState, useEffect, useCallback } from "react"

// Toast = the small popup message at the bottom ("Note saved").
// Before: the toast lived inside App.jsx, so other pages could not use it.
// Now: any component can call  showToast("message")  using this context.

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  // useCallback keeps the same function between renders,
  // so components that use showToast don't re-run their effects for no reason
  const showToast = useCallback((message) => {
    // we store an id too, so showing the same message twice still restarts the timer
    setToast({ text: message, id: Date.now() })
  }, [])

  // hide the toast automatically after 2.6 seconds
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(timer)
  }, [toast])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <div className="toast" role="status">
          {toast.text}
        </div>
      )}
    </ToastContext.Provider>
  )
}

// small helper so components can write:  const { showToast } = useToast()
export function useToast() {
  return useContext(ToastContext)
}
