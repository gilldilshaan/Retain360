import React from "react"

export default function StatCard({ value, label, sub }) {
  return (
    <div className="stat-card">
      <span className="stat-value serif">{value}</span>
      <span className="stat-label">{label}</span>
      <span className="stat-sub">{sub}</span>
    </div>
  )
}
