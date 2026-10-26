import React, { useState } from "react"
import { useToast } from "../../context/ToastContext.jsx"
import { required, email, minLength } from "./validation.js"
import { subjects } from "../../data/subjects.js"
import Input from "./Input.jsx"
import Select from "./Select.jsx"

export default function RegistrationForm({ onSubmit, isSubmitting }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    semester: "",
    agreement: false,
  })
  const [errors, setErrors] = useState({})
  const { showToast } = useToast()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const validate = () => {
    const newErrors = {}

    if (required(form.name)) newErrors.name = required(form.name)
    else newErrors.name = minLength(2)(form.name)

    if (required(form.email)) newErrors.email = required(form.email)
    else newErrors.email = email(form.email)

    if (required(form.subject)) newErrors.subject = required(form.subject)
    else newErrors.subject = ""

    if (required(form.semester)) newErrors.semester = required(form.semester)
    else newErrors.semester = ""

    if (!form.agreement) newErrors.agreement = "You must agree to the terms."

    setErrors(newErrors)
    return Object.values(newErrors).every((e) => e === "")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(form)
      showToast("Registration submitted successfully")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="registration-form">
      <div className="form-group">
        <label htmlFor="name" className="form-label">
          Name
          <span className="form-required">*</span>
        </label>
        <Input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Full name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Email
          <span className="form-required">*</span>
        </label>
        <Input
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          type="email"
          placeholder="name@example.com"
        />
      </div>

      <div className="form-group">
        <label htmlFor="subject" className="form-label">
          Subject
          <span className="form-required">*</span>
        </label>
        <Select
          id="subject"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          options={subjects.map((s) => ({ value: s.id, label: s.name }))}
          error={errors.subject}
        />
      </div>

      <div className="form-group">
        <label htmlFor="semester" className="form-label">
          Semester
          <span className="form-required">*</span>
        </label>
        <Select
          id="semester"
          name="semester"
          value={form.semester}
          onChange={handleChange}
          options={[
            { value: "1", label: "Semester 1" },
            { value: "2", label: "Semester 2" },
            { value: "3", label: "Semester 3" },
            { value: "4", label: "Semester 4" },
          ]}
          error={errors.semester}
        />
      </div>

      <div className="form-group form-group-agree">
        <input
          type="checkbox"
          id="agreement"
          name="agreement"
          checked={form.agreement}
          onChange={handleChange}
          className="agreement-checkbox"
        />
        <label htmlFor="agreement" className="agreement-label">
          I agree to the terms and conditions
          <span className="form-required">*</span>
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Register"}
        </button>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => setForm({ name: "", email: "", subject: "", semester: "", agreement: false })}
        >
          Clear
        </button>
      </div>
    </form>
  )
}