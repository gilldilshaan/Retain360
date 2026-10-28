import React, { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import StatCard from "./dashboard/StatCard.jsx"
import RetentionIndicator from "./RetentionIndicator.jsx"
import { buildNotifications } from "./dashboard/NotificationsPanel.jsx"
import { notes } from "../data/notes.js"
import { semesters } from "../data/subjects.js"
import { CURRENT_SEMESTER, profile } from "../data/profile.js"
import { useApp } from "../context/AppContext.jsx"

export default function Dashboard(props = {}) {
  const context = useApp()
  const conceptsLive = props.conceptsLive ?? context.conceptsLive
  const conceptsLiveById = props.conceptsLiveById ?? context.conceptsLiveById
  const activities = props.activities ?? context.activities
  const notifications = props.notifications ?? context.notifications
  const onExplore = props.onExplore ?? context.goToConcept
  const onRefresh = props.onRefresh ?? context.setRefreshId
  const navigate = useNavigate()
  const [revisionCategory, setRevisionCategory] = useState("needs-revision")

  const stats = useMemo(() => {
    const total = conceptsLive.length
    const fading = conceptsLive.filter((c) => c.status === "fading").length
    const health = Math.round(conceptsLive.reduce((sum, c) => sum + c.retention, 0) / total)
    return { total, fading, health }
  }, [conceptsLive])

  // Category 1: Needs Revision (retention < 65, sorted ascending by retention)
  const reviseList = useMemo(
    () =>
      conceptsLive
        .filter((c) => c.retention < 65)
        .sort((a, b) => a.retention - b.retention),
    [conceptsLive]
  )

  // Category 2: Recently Reviewed (concepts that have been reviewed in this session)
  const recentlyReviewed = useMemo(() => {
    const reviewedIds = activities
      .filter((a) => a.icon === "✓" && a.conceptId)
      .map((a) => a.conceptId)
    const uniqueIds = [...new Set(reviewedIds)]
    return uniqueIds.map((id) => conceptsLiveById[id]).filter(Boolean)
  }, [activities, conceptsLiveById])

  // Category 3: All Concepts (sorted by retention ascending to surface weaker material)
  const allConceptsSorted = useMemo(
    () => [...conceptsLive].sort((a, b) => a.retention - b.retention),
    [conceptsLive]
  )

  const displayedRevisionList = useMemo(() => {
    switch (revisionCategory) {
      case "recently-reviewed":
        return recentlyReviewed
      case "all":
        return allConceptsSorted.slice(0, 8)
      case "needs-revision":
      default:
        return reviseList.slice(0, 6)
    }
  }, [revisionCategory, recentlyReviewed, allConceptsSorted, reviseList])

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
              <div className="dash-card-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => (onRefresh ? onRefresh(recommended.id) : onExplore(recommended.id))}
                >
                  Quick Refresh <span className="btn-orb">→</span>
                </button>
                <button
                  type="button"
                  className="btn btn-quiet"
                  onClick={() => onExplore(recommended.id)}
                >
                  Explore in Web
                </button>
              </div>
            </>
          ) : (
            <p className="muted-note">Nothing needs special attention right now.</p>
          )}
        </div>
      </section>

      <section className="dash-grid">
        {/* concept revision */}
        <article className="panel-card">
          <div className="panel-head">
            <span className="micro">Concept Revision</span>
            <button
              type="button"
              className="link-btn"
              onClick={() => navigate(revisionCategory === "all" ? "/knowledge" : "/memory")}
            >
              View all
            </button>
          </div>

          <div className="revision-tabs" role="tablist" aria-label="Revision categories">
            <button
              type="button"
              role="tab"
              aria-selected={revisionCategory === "needs-revision"}
              className={`rev-tab${revisionCategory === "needs-revision" ? " active" : ""}`}
              onClick={() => setRevisionCategory("needs-revision")}
            >
              Needs Revision ({reviseList.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={revisionCategory === "recently-reviewed"}
              className={`rev-tab${revisionCategory === "recently-reviewed" ? " active" : ""}`}
              onClick={() => setRevisionCategory("recently-reviewed")}
            >
              Recently Reviewed ({recentlyReviewed.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={revisionCategory === "all"}
              className={`rev-tab${revisionCategory === "all" ? " active" : ""}`}
              onClick={() => setRevisionCategory("all")}
            >
              All Concepts ({conceptsLive.length})
            </button>
          </div>

          {displayedRevisionList.length === 0 ? (
            <p className="muted-note">
              {revisionCategory === "recently-reviewed"
                ? "No concepts reviewed yet in this session. Start a quick refresh on any concept below."
                : "Everything is holding steady. Nice work."}
            </p>
          ) : (
            <ul className="attention-list">
              {displayedRevisionList.map((c) => {
                const isUrgent = c.retention < 50
                const isSoon = c.retention >= 50 && c.retention < 65
                const badgeLabel = isUrgent
                  ? "Needs Revision"
                  : isSoon
                  ? "Review Soon"
                  : c.retention >= 75
                  ? "Strong"
                  : "Steady"
                const badgeClass = isUrgent ? "urgent" : isSoon ? "soon" : "steady"

                return (
                  <li key={c.id} className="attention-item">
                    <div className="attention-row">
                      <button
                        type="button"
                        className="attention-main-btn"
                        onClick={() => onExplore(c.id)}
                        title={`Explore ${c.name} on Knowledge Web`}
                      >
                        <span className="attention-name">{c.name}</span>
                        <span className="micro attention-sem">SEM {c.semester}</span>
                      </button>
                      <div className="attention-side">
                        <span className={`badge ${badgeClass}`}>{badgeLabel}</span>
                        <span className="attention-pct">{c.retention}%</span>
                        {onRefresh && (
                          <button
                            type="button"
                            className="rev-action-btn"
                            onClick={(e) => {
                              e.stopPropagation()
                              onRefresh(c.id)
                            }}
                            title={`Quick refresh ${c.name}`}
                          >
                            Review
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
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
              <li key={a.id}>
                {a.conceptId ? (
                  <button
                    type="button"
                    className="activity-row activity-btn"
                    onClick={() => onExplore(a.conceptId)}
                    title={`Explore ${a.text.replace(/^(Reviewed|Explored|Opened)\s+/, "")} on Knowledge Web`}
                  >
                    <span className={`activity-icon${a.icon === "✓" ? " done" : ""}`}>{a.icon}</span>
                    <span className="activity-text">{a.text}</span>
                    <span className="activity-when">{a.when}</span>
                  </button>
                ) : (
                  <div className="activity-row">
                    <span className={`activity-icon${a.icon === "✓" ? " done" : ""}`}>{a.icon}</span>
                    <span className="activity-text">{a.text}</span>
                    <span className="activity-when">{a.when}</span>
                  </div>
                )}
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