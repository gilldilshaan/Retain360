import KnowledgeRing from "./KnowledgeRing";

export default function MemoryHero({
  overallHealth = 69,
  subjectStats = [],
  summaryCounts = { total: 8, fading: 3, strong: 4, recent: 1 },
  selectedSubject = "all",
  onSelectSubject,
  onStartReview,
  onExploreMemory,
  dynamicInsight,
}) {
  return (
    <section className="exact-hero-container">
      <div className="hero-two-column-layout">
        <div className="hero-left-narrative">
          <span className="hero-kicker-label">MEMORY CENTER</span>

          <h1 className="hero-headline-serif">Knowledge Health</h1>

          <p className="hero-philosophical-quote">
            "Your degree is only as strong as what you can still recall."
          </p>

          <p className="hero-dynamic-verdict">
            {dynamicInsight ||
              "Your strongest domain is AI / ML (83%). Mathematics fundamentals (62%) need attention."}
          </p>

          <div className="hero-actions-row">
            <button
              type="button"
              className="hero-start-review-btn"
              onClick={onStartReview}
            >
              <span className="btn-lightning-icon">⚡</span>
              <span>Start Review</span>
            </button>

            <button
              type="button"
              className="hero-explore-memory-btn"
              onClick={onExploreMemory}
            >
              <span>▷</span>
              <span>Explore Memory</span>
            </button>
          </div>

          <div className="hero-four-metrics-grid">
            <div className="metric-box-card">
              <div className="metric-icon-wrap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8C6046" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <span className="metric-value-numeral">{summaryCounts.total || 8}</span>
              <span className="metric-label-text">Topics Tracked</span>
            </div>

            <div className="metric-box-card">
              <div className="metric-icon-wrap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#96584E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <span className="metric-value-numeral">{summaryCounts.fading || 3}</span>
              <span className="metric-label-text">Need Revision</span>
            </div>

            <div className="metric-box-card">
              <div className="metric-icon-wrap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#798165" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <span className="metric-value-numeral">{summaryCounts.strong || 4}</span>
              <span className="metric-label-text">Strong Topics</span>
            </div>

            <div className="metric-box-card">
              <div className="metric-icon-wrap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C69255" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <span className="metric-value-numeral">{summaryCounts.recent || 1}</span>
              <span className="metric-label-text">Recently Revised</span>
            </div>
          </div>
        </div>

        <KnowledgeRing
          overallHealth={overallHealth}
          subjectStats={subjectStats}
          selectedSubject={selectedSubject}
          onSelectSubject={onSelectSubject}
        />
      </div>
    </section>
  );
}
