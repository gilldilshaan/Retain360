export function required(value) {
  if (!value || value.trim() === "") return "This field is required."
  return ""
}

export function email(value) {
  if (!value || value.trim() === "") return ""
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!re.test(value)) return "Please enter a valid email address."
  return ""
}

export function password(value) {
  if (!value || value.trim() === "") return "Password is required."
  if (value.length < 6) return "Password must be at least 6 characters."
  return ""
}

export function confirmPassword(value, original) {
  if (!value || value.trim() === "") return "Please confirm your password."
  if (value !== original) return "Passwords do not match."
  return ""
}

export function minLength(min) {
  return function (value) {
    if (!value || value.trim() === "") return ""
    if (value.length < min) return `Minimum ${min} characters required.`
    return ""
  }
}