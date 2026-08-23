import React, { useMemo } from "react"

// The product home. All numbers are computed from the same mock data the
// Knowledge Map uses — nothing is hardcoded twice.
export default function Dashboard({ conceptsLive, conceptsLiveById, activities, onExplore }) {
  const stats = useMemo(() => {
    const total = conceptsLive.length
    const fading = conceptsLive.filter((c) => c.status === "fading").length
    const health = Math.round(
      conceptsLive.reduce((sum, c) => sum + c.retention, 0) / total
    )
    return { total, fading, health }
  }, [conceptsLive])

  // Concepts that most need a refresh, weakest first.
  const needsAttention = useMemo(
    () =>
      conceptsLive
        .filter((c) => c.retention < 65)
        .sort((a, b) => a.retention - b.retention)
        .slice(0, 5),
    [conceptsLive]
  )

  const continueConcept = useMemo(
    () => conceptsLive.find((c) => c.id === "neural-networks"),
    [conceptsLive]
  )

  return (
    <div className="page">
      {/* hero */}
      <section className="dash-hero">
        <h2 className="serif">
          Your degree is more connected
          <br />
          than you think.
        </h2>
        <p>Explore the knowledge you&rsquo;ve built across semesters.</p>
      </section>

      {/* stats */}
      <section className="stat-cards">
        <StatCard value={stats.total} label="Concepts" sub="across 4 semesters" />
        <StatCard value={stats.fading} label="Fading" sub="need a refresh" />
        <StatCard value={`${stats.health}%`} label="Knowledge Health" sub="average retention" />
      </section>

      {/* continue learning + attention */}
      <section className="dash-grid">
        <article className="panel-card">
          <span className="micro">Continue Learning</span>
          {continueConcept && (
            <>
              <h3 className="panel-title serif">{continueConcept.name}</h3>
              <p className="panel-sub">
                Artificial Intelligence · Semester {continueConcept.semester}
              </p>
              <p className="panel-builton">
                Built on:{" "}
                {(continueConcept.prerequisites || [])
                  .slice(0, 3)
                  .map((id) => conceptsLiveById[id]?.name)
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => onExplore(continueConcept.id)}
              >
                Explore Connection →
              </button>
            </>
          )}
        </article>

        <article className="panel-card">
          <span className="micro">Knowledge Needs Attention</span>
          <ul className="attention-list">
            {needsAttention.map((c) => (
              <li key={c.id}>
                <button type="button" className="attention-row" onClick={() => onExplore(c.id)}>
                  <span className="attention-name">{c.name}</span>
                  <span className="attention-pct">{c.retention}%</span>
                </button>
              </li>
            ))}
          </ul>
        </article>
      </section>

      {/* recent activity */}
      <section className="panel-card activity-card">
        <span className="micro">Recent Activity</span>
        <ul className="activity-list">
          {activities.map((a) => (
            <li key={a.id} className="activity-row">
              <span className={`activity-icon${a.icon === "✓" ? " done" : ""}`}>{a.icon}</span>
              <span className="activity-text">{a.text}</span>
              <span className="activity-when">{a.when}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function StatCard({ value, label, sub }) {
  return (
    <div className="stat-card">
      <span className="stat-value serif">{value}</span>
      <span className="stat-label">{label}</span>
      <span className="stat-sub">{sub}</span>
    </div>
  )
}