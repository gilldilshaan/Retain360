export default function FadingTopics({
  fadingTopics = [],
  onReviewTopic,
}) {
  const topFading = fadingTopics.slice(0, 3);

  const getPriorityBadge = (retention) => {
    if (retention <= 42) return { label: "VERY HIGH", className: "badge-very-high" };
    if (retention <= 50) return { label: "HIGH", className: "badge-high" };
    return { label: "MEDIUM", className: "badge-medium" };
  };

  const getDecayDelta = (retention) => {
    if (retention <= 42) return "↓ 12%";
    if (retention <= 48) return "↓ 8%";
    return "↓ 5%";
  };

  return (
    <section className="exact-fading-section">
      <div className="fading-header-area">
        <div className="fading-icon-wrap">
          <span style={{ color: "#C86D51", fontSize: "14px" }}>↗</span>
        </div>
        <div>
          <h2 className="fading-heading">WHAT'S FADING</h2>
          <p className="fading-sub-caption">
            Concepts with lowest retention score and longest time since last review.
          </p>
        </div>
      </div>

      <div className="fading-stacked-rows-list">
        {topFading.map((topic, index) => {
          const rank = String(index + 1).padStart(2, "0");
          const priority = getPriorityBadge(topic.retention);
          const delta = getDecayDelta(topic.retention);

          return (
            <div
              key={topic.id}
              className="fading-exact-row-card"
              onClick={() => onReviewTopic(topic)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onReviewTopic(topic);
                }
              }}
            >
              <div className="fading-row-rank-num">{rank}</div>

              <div className="fading-name-column">
                <h3 className="fading-topic-headline">{topic.name}</h3>
                <span className="fading-subject-subtext">{topic.subject}</span>
              </div>

              <div className="fading-retention-column">
                <span className="fading-retention-big">{topic.retention}%</span>
                <span className="fading-decay-delta">{delta}</span>
              </div>

              <div className="fading-timing-column">
                <span className="revised-days-text">{topic.lastRevised}</span>
                <span className="revised-sub-label">Last revised</span>
              </div>

              <div className="fading-priority-column">
                <span className={`fading-priority-pill ${priority.className}`}>
                  {priority.label}
                </span>
              </div>

              <div className="fading-action-column">
                <button
                  type="button"
                  className="fading-row-review-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReviewTopic(topic);
                  }}
                >
                  Review →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="fading-footer-link-row">
        <button
          type="button"
          className="view-all-fading-btn"
          onClick={() => {
            const el = document.getElementById("topic-explorer");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        >
          View all fading topics →
        </button>
      </div>
    </section>
  );
}
