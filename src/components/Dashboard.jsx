import React, { useMemo } from "react"
import { useNavigate } from "react-router-dom"

import StatCard from "./dashboard/StatCard.jsx"
import RetentionIndicator from "./RetentionIndicator.jsx"
import { buildNotifications } from "./dashboard/NotificationsPanel.jsx"
import { notes } from "../data/notes.js"
import { semesters } from "../data/subjects.js"
import { CURRENT_SEMESTER, profile } from "../data/profile.js"

export default function Dashboard({ conceptsLive, conceptsLiveById, activities, notifications, onExplore }) {
  const navigate = useNavigate()

  const stats = useMemo(() => {
    const total = conceptsLive.length
    const fading = conceptsLive.filter((c) => c.status === "fading").length
    const health = Math.round(conceptsLive.reduce((sum, c) => sum + c.retention, 0) / total)
    return { total, fading, health }
  }, [conceptsLive])

  // retention < 50 → Needs Revision, otherwise Review Soon
  const reviseList = useMemo(
    () =>
      conceptsLive
        .filter((c) => c.retention < 65)
        .sort((a, b) => a.retention - b.retention)
        .slice(0, 6),
    [conceptsLive]
  )

  // mock recommendation: a weak concept that unlocks stronger material later
  const recommended = useMemo(() => {
    const weak = conceptsLive
      .filter((c) => (c.usedIn || []).length > 0 && c.retention < 70)
      .sort((a, b) => a.retention - b.retention)
    return (
      weak.find((c) =>
        c.usedIn.some((id) => (conceptsLiveById[id]?.retention ?? 0) > c.retention + 10)
      ) || weak[0]
    )
  }, [conceptsLive, conceptsLiveById])

  const recommendedNext = useMemo(() => {
    if (!recommended) return null
    return (
      recommended.usedIn
        .map((id) => conceptsLiveById[id])
        .find((c) => c && c.retention > recommended.retention) || null
    )
  }, [recommended, conceptsLiveById])

  const currentSemester = useMemo(() => {
    const meta = semesters.find((s) => s.id === CURRENT_SEMESTER)
    const list = conceptsLive.filter((c) => c.semester === CURRENT_SEMESTER)
    const avg = list.length
      ? Math.round(list.reduce((sum, c) => sum + c.retention, 0) / list.length)
      : 0
    return { ...meta, count: list.length, avg }
  }, [conceptsLive])

  const recentNotes = useMemo(
    () =>
      [...notes]
        .reverse()
        .slice(0, 3)
        .map((n) => ({ ...n, concept: conceptsLiveById[n.conceptId] }))
        .filter((n) => n.concept),
    [conceptsLiveById]
  )

  const dashboardNotifications = useMemo(
    () => (notifications || buildNotifications(conceptsLive)).slice(0, 4),
    [notifications, conceptsLive]
  )

  return (
    <div className="page">
      {/* hero: greeting on the left, live health on the right */}
      <section className="dash-hero">
        <div>
          <span className="micro">Welcome back</span>
          <h2 className="serif">
            Good to see you, {profile.name.split(" ")[0]}.
          </h2>
          <p>Here&rsquo;s where your knowledge stands today.</p>
        </div>
        <div className="hero-health" aria-label={`Knowledge health ${stats.health}%`}>
          <span className="hero-health-value serif">{stats.health}%</span>
          <span className="micro">Knowledge Health</span>
          <RetentionIndicator value={stats.health} />
        </div>
      </section>

      {/* quick statistics */}
      <section className="stat-cards four">
        <StatCard value={stats.total} label="Concepts" sub="on your map" />
        <StatCard value={stats.fading} label="Fading" sub="need a refresh" />
        <StatCard value={`${stats.health}%`} label="Knowledge Health" sub="average retention" />
        <StatCard value={`SEM ${currentSemester.id}`} label="Now Studying" sub={`${currentSemester.avg}% semester avg`} />
      </section>

      {/* today's focus: semester + recommendation share one document */}
      <section className="panel-card focus-panel">
        <div className="focus-col">
          <span className="micro">Current Semester</span>
          <h3 className="panel-title serif">
            SEM {currentSemester.id} · {currentSemester.name}
          </h3>
          <p className="panel-sub">
            {currentSemester.count} concepts · {currentSemester.avg}% average retention
          </p>
          <button type="button" className="btn btn-quiet" onClick={() => navigate("/knowledge")}>
            Open Knowledge Web
          </button>
        </div>

        <div className="focus-divider" aria-hidden="true" />

        <div className="focus-col">
          <span className="micro">Recommended Revision</span>
          {recommended ? (
            <>
              <h3 className="panel-title serif">{recommended.name}</h3>
              {recommendedNext ? (
                <p className="panel-builton">
                  Revisit this before continuing with <strong>{recommendedNext.name}</strong>.
                </p>
              ) : (
                <p className="panel-builton">Weakest link on your map right now.</p>
              )}
              <span className="rec-note micro">Suggested from your own graph — not AI.</span>
              <button type="button" className="btn btn-primary" onClick={() => onExplore(recommended.id)}>
                Revise Now<span className="btn-orb">→</span>
              </button>
            </>
          ) : (
            <p className="muted-note">Nothing needs special attention right now.</p>
          )}
        </div>
      </section>

      <section className="dash-grid">
        {/* needs revision */}
        <article className="panel-card">
          <div className="panel-head">
            <span className="micro">Needs Revision</span>
            <button type="button" className="link-btn" onClick={() => navigate("/memory")}>
              View all
            </button>
          </div>
          {reviseList.length === 0 ? (
            <p className="muted-note">Everything is holding steady. Nice work.</p>
          ) : (
            <ul className="attention-list">
              {reviseList.map((c) => (
                <li key={c.id}>
                  <button type="button" className="attention-row" onClick={() => onExplore(c.id)}>
                    <span className="attention-name">{c.name}</span>
                    <span className="attention-side">
                      <span className={`badge ${c.retention < 50 ? "urgent" : "soon"}`}>
                        {c.retention < 50 ? "Needs Revision" : "Review Soon"}
                      </span>
                      <span className="attention-pct">{c.retention}%</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </article>

        {/* recent notes */}
        <article className="panel-card">
          <div className="panel-head">
            <span className="micro">Recent Notes</span>
            <button type="button" className="link-btn" onClick={() => navigate("/notes")}>
              View all
            </button>
          </div>
          <ul className="attention-list">
            {recentNotes.map((n) => (
              <li key={n.id}>
                <button type="button" className="note-mini" onClick={() => onExplore(n.conceptId)}>
                  <span className="note-mini-title">{n.title}</span>
                  <span className="note-mini-meta">
                    {n.concept.name} · {n.type}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="dash-grid">
        {/* recently studied */}
        <article className="panel-card activity-card">
          <div className="panel-head">
            <span className="micro">Recently Studied</span>
          </div>
          <ul className="activity-list">
            {activities.slice(0, 5).map((a) => (
              <li key={a.id} className="activity-row">
                <span className={`activity-icon${a.icon === "✓" ? " done" : ""}`}>{a.icon}</span>
                <span className="activity-text">{a.text}</span>
                <span className="activity-when">{a.when}</span>
              </li>
            ))}
          </ul>
        </article>

        {/* notifications */}
        <article className="panel-card">
          <div className="panel-head">
            <span className="micro">Notifications</span>
          </div>
          <ul className="notif-list static">
            {dashboardNotifications.map((n) => (
              <li key={n.id} className={`notif-item${n.tone === "warn" ? " warn" : ""}`}>
                <span className="notif-dot" aria-hidden="true" />
                <span className="notif-copy">
                  <span className="notif-title">{n.title}</span>
                  <span className="notif-body">{n.body}</span>
                </span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      {/* quick navigation */}
      <section className="quick-actions">
        <button type="button" className="btn btn-quiet" onClick={() => navigate("/knowledge")}>
          Knowledge Web
        </button>
        <button type="button" className="btn btn-quiet" onClick={() => navigate("/memory")}>
          Memory
        </button>
        <button type="button" className="btn btn-quiet" onClick={() => navigate("/notes")}>
          My Notes
        </button>
        <button type="button" className="btn btn-quiet" onClick={() => navigate("/subjects")}>
          Subjects
        </button>
      </section>
    </div>
  )
}