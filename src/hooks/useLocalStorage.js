import { useState, useEffect } from "react"

// A custom hook that works exactly like useState,
// but it also saves the value in the browser (localStorage).
// So when the page is refreshed, the data does not disappear.


export default function useLocalStorage(key, initialValue) {
  // 1. Start with the saved value if there is one, otherwise use the default
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      if (saved !== null) {
        return JSON.parse(saved)
      }
      return initialValue
    } catch (error) {
      console.log("Could not read from localStorage", error)
      return initialValue
    }
  })

  // 2. Every time the value changes, save it again
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.log("Could not save to localStorage", error)
    }
  }, [key, value])

  return [value, setValue]
}
