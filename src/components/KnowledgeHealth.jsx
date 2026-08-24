import React, { useMemo } from "react"
import { subjects, subjectOf } from "../data/subjects.js"

// ── simple retention thresholds (same logic as RetentionIndicator) ──
const statusOf = (retention) =>
  retention >= 75 ? "strong" : retention >= 55 ? "steady" : "fading"

const STATUS_LABEL = { strong: "Strong", steady: "Steady", fading: "Fading" }

// clearly-labelled mock history — only "Today" is live data
const TREND_HISTORY = [
  { label: "Week 1", value: 61 },
  { label: "Week 2", value: 63 },
  { label: "Week 3", value: 66 },
]

// seeded revision log (frontend only, grows via the shared activities list)
const SEED_REVIEWS = [
  { id: "seed-1", name: "Matrix Multiplication", when: "Today" },
  { id: "seed-2", name: "Functions", when: "Yesterday" },
  { id: "seed-3", name: "Probability", when: "3 days ago" },
]

// thin progress bar used across this page
function MemMeter({ value, low }) {
  return (
    <div
      className={`mem-meter${low ? " low" : ""}`}
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      aria-label={`Retention ${value}%`}
    >
      <span style={{ width: `${value}%` }} />
    </div>
  )
}

export default function KnowledgeHealth({
  conceptsLive,
  activities = [],
  onSelectConcept,
  onRefresh,
  onOpenSubject,
}) {
  // ── every number below is derived from the live concept list ──
  const report = useMemo(() => {
    const total = conceptsLive.length
    const avg = Math.round(conceptsLive.reduce((s, c) => s + c.retention, 0) / total)
    const strong = conceptsLive.filter((c) => c.retention >= 75)
    const steady = conceptsLive.filter((c) => c.retention >= 55 && c.retention < 75)
    const fading = conceptsLive.filter((c) => c.retention < 55)

    // average retention per subject
    const bySubject = subjects
      .map((s) => {
        const list = conceptsLive.filter((c) => c.subject === s.id)
        return {
          ...s,
          count: list.length,
          avg: list.length
            ? Math.round(list.reduce((sum, c) => sum + c.retention, 0) / list.length)
            : 0,
        }
      })
      .filter((s) => s.count > 0)
      .sort((a, b) => b.avg - a.avg)

    // anything drifting below 65%, weakest first
    const weakening = conceptsLive
      .filter((c) => c.retention < 65)
      .sort((a, b) => a.retention - b.retention)

    const liveById = Object.fromEntries(conceptsLive.map((c) => [c.id, c]))

    return { avg, total, strong, steady, fading, bySubject, weakening, liveById }
  }, [conceptsLive])

  // why-this-matters: the fading concept that the most other work depends on
  const focus = useMemo(
    () =>
      [...report.fading].sort(
        (a, b) => (b.usedIn || []).length - (a.usedIn || []).length || a.retention - b.retention
      )[0] || null,
    [report.fading]
  )

  // recommended reviews: weak AND used by later concepts, weakest first
  const recommended = useMemo(
    () =>
      conceptsLive
        .filter((c) => c.retention < 70 && (c.usedIn || []).length > 0)
        .sort((a, b) => a.retention - b.retention)
        .slice(0, 3),
    [conceptsLive]
  )

  // trend: mock weeks + today's live average as the final point
  const trend = [...TREND_HISTORY, { label: "Today", value: report.avg }]
  const trendGain = trend[trend.length - 1].value - trend[0].value

  // recent revision: fresh reviews first, then seeded examples (no duplicates)
  const freshReviews = activities
    .filter((a) => a.text.startsWith("Reviewed"))
    .slice(0, 2)
    .map((a) => ({ id: a.id, name: a.text.replace("Reviewed ", ""), when: a.when }))
  const mergedReviews = []
  for (const r of [...freshReviews, ...SEED_REVIEWS]) {
    if (!mergedReviews.some((m) => m.name === r.name)) mergedReviews.push(r)
  }
  const recentReviews = mergedReviews.slice(0, 4)

  const healthNote =
    report.fading.length === 0
      ? "Every concept is holding above 55% — nothing needs urgent attention."
      : `Most of your knowledge is holding, but ${report.fading.length} ${
          report.fading.length === 1 ? "concept is" : "concepts are"
        } beginning to fade.`

  return (
    <div className="page">
      {/* contextual lead under the page header */}
      <p className="mem-lead">
        Your knowledge is strongest where you&rsquo;ve revisited it. These{" "}
        {report.weakening.length} concepts may need attention before they become
        prerequisites again.
      </p>

      <div className="mem-grid">
        {/* ── 1 · overall knowledge health ── */}
        <section className="panel-card mem-health">
          <span className="micro">Overall Knowledge Health</span>
          <span className="mem-health-value serif">{report.avg}%</span>
          <span className="mem-health-sub">
            Average retention across your {report.total} concepts
          </span>

          <div className="mem-health-scale">
            <MemMeter value={report.avg} />
            <span className="mem-tick" style={{ left: "55%" }} data-label="55" />
            <span className="mem-tick" style={{ left: "75%" }} data-label="75" />
          </div>

          <p className="mem-health-note">{healthNote}</p>

          {/* supporting metrics share the panel so 68% stays dominant */}
          <div className="mem-health-stats">
            <div>
              <span className="mem-hstat-value serif">{report.strong.length}</span>
              <span className="mem-hstat-label">Strong</span>
              <span className="mem-hstat-range">75%+</span>
            </div>
            <div>
              <span className="mem-hstat-value serif">{report.steady.length}</span>
              <span className="mem-hstat-label">Steady</span>
              <span className="mem-hstat-range">55–74%</span>
            </div>
            <div>
              <span className="mem-hstat-value serif">{report.fading.length}</span>
              <span className="mem-hstat-label">Fading</span>
              <span className="mem-hstat-range">below 55%</span>
            </div>
          </div>
        </section>

        {/* ── 2 · knowledge by subject ── */}
        <section className="mem-subjects">
          <header className="mem-section-head">
            <span className="micro">Knowledge by Subject</span>
          </header>
          <ul className="mem-subject-list">
            {report.bySubject.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  className="mem-subject-row"
                  onClick={() => onOpenSubject(s.id)}
                  title={`Open ${s.name} in the Knowledge Web`}
                >
                  <span className="mem-subject-name">
                    {s.name}
                    <span className="mem-subject-count">{s.count} concepts</span>
                  </span>
                  <MemMeter value={s.avg} low={s.avg < 65} />
                  <span className="mem-subject-pct serif">{s.avg}%</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mem-section-foot">Select a subject to see it in the Knowledge Web.</p>
        </section>

        {/* ── 3 · concepts losing strength ── */}
        <section className="panel-card mem-fading">
          <header className="mem-panel-head">
            <h3 className="serif">Concepts Losing Strength</h3>
            <span className="micro">{report.weakening.length} below 65%</span>
          </header>

          {report.weakening.length === 0 ? (
            <p className="muted-note">Nothing is fading. Every concept holds above 65%.</p>
          ) : (
            <ul className="mem-fade-list">
              {report.weakening.map((c) => (
                <li key={c.id} className="mem-fade-row">
                  <div className="mem-fade-top">
                    <button
                      type="button"
                      className="mem-fade-name"
                      onClick={() => onSelectConcept(c.id)}
                      title="Open in Knowledge Web"
                    >
                      {c.name}
                    </button>
                    <span className="mem-fade-side">
                      <span className="mem-fade-pct serif">{c.retention}%</span>
                      <span className={`badge ${c.retention < 55 ? "urgent" : "soon"}`}>
                        {STATUS_LABEL[statusOf(c.retention)]}
                      </span>
                    </span>
                  </div>

                  <span className="mem-fade-meta">
                    {subjectOf(c.subject).toUpperCase()} · SEMESTER {c.semester}
                    {(c.usedIn || []).length > 0 &&
                      ` · USED BY ${(c.usedIn || [])
                        .slice(0, 2)
                        .map((id) => report.liveById[id]?.name)
                        .filter(Boolean)
                        .join(" · ")
                        .toUpperCase()}`}
                  </span>

                  <div className="mem-fade-bottom">
                    <MemMeter value={c.retention} low={c.retention < 55} />
                    <button type="button" className="btn btn-quiet mem-btn-sm" onClick={() => onRefresh(c.id)}>
                      Review
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ── 4 · why this matters ── */}
        {focus && (
          <section className="mem-focus">
            <span className="micro mem-focus-label">Why This Matters</span>
            <h3 className="serif mem-focus-name">{focus.name}</h3>
            <p className="mem-focus-ret">
              <strong>{focus.retention}%</strong> retention · learned in Semester {focus.semester}
            </p>
            {(focus.usedIn || []).length > 0 && (
              <>
                <p className="mem-focus-copy">
                  It is still a foundation for what you&rsquo;re learning now:
                </p>
                <ul className="mem-focus-uses">
                  {focus.usedIn.slice(0, 3).map((id) => (
                    <li key={id}>
                      <button type="button" onClick={() => onSelectConcept(id)}>
                        {report.liveById[id]?.name || id} →
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <p className="mem-focus-note">
              Your retention is low enough that a quick review may help.
            </p>
            <div className="mem-focus-actions">
              <button type="button" className="btn btn-primary" onClick={() => onRefresh(focus.id)}>
                Quick Refresh
              </button>
              {(focus.usedIn || [])[0] && (
                <button
                  type="button"
                  className="mem-ghost"
                  onClick={() => onSelectConcept(focus.usedIn[0])}
                >
                  Explore Connection →
                </button>
              )}
            </div>
          </section>
        )}

        {/* ── 5 · recommended reviews ── */}
        <section className="mem-recommended">
          <header className="mem-section-head">
            <span className="micro">Recommended for You</span>
            <span className="mem-section-hint">Weak now, needed soon</span>
          </header>
          {recommended.length === 0 ? (
            <p className="muted-note">No recommendations — your weaker concepts aren&rsquo;t blocking anything.</p>
          ) : (
            <div className="mem-rec-grid">
              {recommended.map((c) => (
                <article key={c.id} className="mem-rec-card">
                  <header className="mem-rec-top">
                    <h4 className="serif">{c.name}</h4>
                    <span className="mem-rec-pct serif">{c.retention}%</span>
                  </header>
                  <span className="mem-rec-meta">
                    {subjectOf(c.subject)} · Semester {c.semester}
                  </span>
                  <p className="mem-rec-why">
                    <span className="micro">Why</span>
                    Used by {(c.usedIn || [])
                      .slice(0, 2)
                      .map((id) => report.liveById[id]?.name)
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <div className="mem-rec-actions">
                    <button type="button" className="btn btn-quiet mem-btn-sm" onClick={() => onRefresh(c.id)}>
                      Review
                    </button>
                    <button
                      type="button"
                      className="mem-link"
                      onClick={() => onSelectConcept(c.id)}
                    >
                      Map →
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* ── 6 + 7 · trend and recent revision ── */}
        <div className="mem-side">
          <section className="mem-trend">
            <header className="mem-section-head">
              <span className="micro">Retention Trend</span>
              {trendGain !== 0 && (
                <span className="mem-section-hint">
                  {trendGain > 0 ? "+" : ""}
                  {trendGain} pts since Week 1
                </span>
              )}
            </header>
            <div className="mem-chart" role="img" aria-label={`Retention trend from ${trend[0].value}% to ${report.avg}%`}>
              {trend.map((pt) => (
                <div key={pt.label} className="mem-col">
                  <span className="mem-col-val">{pt.value}%</span>
                  <span
                    className={`mem-col-bar${pt.label === "Today" ? " now" : ""}`}
                    style={{ height: `${pt.value}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="mem-chart-labels" aria-hidden="true">
              {trend.map((pt) => (
                <span key={pt.label}>{pt.label}</span>
              ))}
            </div>
            <p className="mem-trend-note">Mock history for illustration — &ldquo;Today&rdquo; is your live average.</p>
          </section>

          <section className="mem-revision">
            <header className="mem-section-head">
              <span className="micro">Recent Revision</span>
            </header>
            <ul className="mem-review-list">
              {recentReviews.map((r) => (
                <li key={r.id}>
                  <span className="mem-check" aria-hidden="true">✓</span>
                  <span className="mem-review-name">{r.name}</span>
                  <span className="mem-review-when">{r.when}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
