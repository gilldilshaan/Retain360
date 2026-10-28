import React, { createContext, useContext, useState, useCallback } from "react"

// Application-wide preference: currently light/dark theme
// Persisted to localStorage so the choice survives page refreshes.

const PreferencesContext = createContext(null)

export function PreferencesProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("retain360-theme")
      return saved || "light"
    } catch (error) {
      console.log("Could not read theme from localStorage", error)
      return "light"
    }
  })

  const setThemePref = useCallback((theme) => {
    setTheme(theme)
    try {
      localStorage.setItem("retain360-theme", theme)
    } catch (error) {
      console.log("Could not save theme to localStorage", error)
    }
  }, [])

  return (
    <PreferencesContext.Provider value={{ theme, setThemePref }}>
      {children}
    </PreferencesContext.Provider>
  )
}

// Small helper so components can write:  const { theme, setThemePref } = usePreferences()
export function usePreferences() {
  return useContext(PreferencesContext)
}