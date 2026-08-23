import React, { useMemo } from "react"
import StatCard from "./dashboard/StatCard.jsx"
import RetentionIndicator from "./RetentionIndicator.jsx"
import { notes } from "../data/notes.js"
import { subjects } from "../data/subjects.js"
import { profile } from "../data/profile.js"

export default function ProfilePage({ conceptsLive }) {
  const stats = useMemo(() => {
    const health = Math.round(conceptsLive.reduce((sum, c) => sum + c.retention, 0) / conceptsLive.length)
    const learned = conceptsLive.filter((c) => c.retention >= 55).length
    const toRevise = conceptsLive.filter((c) => c.status === "fading").length
    return { health, learned, toRevise }
  }, [conceptsLive])

  const subjectRows = useMemo(
    () =>
      subjects
        .map((s) => {
          const list = conceptsLive.filter((c) => c.subject === s.id)
          const avg = list.length
            ? Math.round(list.reduce((sum, c) => sum + c.retention, 0) / list.length)
            : null
          return { id: s.id, name: s.name, count: list.length, avg }
        })
        .filter((s) => s.count > 0),
    [conceptsLive]
  )

  return (
    <div className="page">
      <section className="profile-hero">
        <span className="profile-avatar serif" aria-hidden="true">
          {profile.initials}
        </span>
        <div>
          <span className="micro">KINSHIP Profile</span>
          <h2 className="profile-name serif">{profile.name}</h2>
          <div className="profile-meta">
            <span className="profile-tag">{profile.degree}</span>
            <span className="profile-tag">Semester {profile.semester}</span>
          </div>
        </div>
      </section>

      <section className="stat-cards four">
        <StatCard value={`${stats.health}%`} label="Knowledge Health" sub="average retention" />
        <StatCard value={stats.learned} label="Concepts Learned" sub={`of ${conceptsLive.length} on the map`} />
        <StatCard value={notes.length} label="Notes" sub="in your library" />
        <StatCard value={stats.toRevise} label="Topics to Revise" sub="fading below 55%" />
      </section>

      <article className="panel-card">
        <span className="micro">Overall Knowledge Strength</span>
        <RetentionIndicator value={stats.health} />
      </article>

      <article className="panel-card">
        <span className="micro">Knowledge Health by Subject</span>
        <ul className="subj-rows">
          {subjectRows.map((s) => (
            <li key={s.id} className="subj-row">
              <span>{s.name}</span>
              <span className="subj-track" role="presentation">
                <span className="subj-fill" style={{ width: `${s.avg}%` }} />
              </span>
              <span className="subj-val serif">{s.avg}%</span>
            </li>
          ))}
        </ul>
      </article>
    </div>
  )
}
