export default function RevisionTimeline({
  history = [],
  onClearHistory,
}) {
  const defaultHistory = [
    {
      id: "h1",
      date: "Today, 10:42 AM",
      topic: "C Pointers",
      notes: "Reviewed pointer arithmetic",
      oldScore: 42,
      newScore: 91,
    },
    {
      id: "h2",
      date: "2 days ago",
      topic: "Probability",
      notes: "Reviewed conditional probability",
      oldScore: 48,
      newScore: 76,
    },
    {
      id: "h3",
      date: "5 days ago",
      topic: "Python Functions",
      notes: "Practiced callbacks and closures",
      oldScore: 78,
      newScore: 91,
    },
  ];

  const items = history.length > 0 ? history : defaultHistory;

  return (
    <div className="exact-journey-card-panel">
      <div className="journey-header-block">
        <h3 className="journey-panel-title">YOUR MEMORY JOURNEY</h3>
        <p className="journey-panel-subtitle">
          A timeline of your revision activity.
        </p>
      </div>

      <div className="journey-timeline-list">
        {items.slice(0, 3).map((entry, index) => {
          const isLast = index === Math.min(items.length, 3) - 1;
          const topicName = entry.topicName || entry.topic || "Concept";
          const prev =
            entry.previousRetention !== undefined
              ? entry.previousRetention
              : entry.oldScore;
          const next =
            entry.newRetention !== undefined
              ? entry.newRetention
              : entry.newScore || entry.score;

          return (
            <div key={entry.id || index} className="journey-timeline-item">
              <div className="journey-axis-col">
                <div className="journey-node-dot" />
                {!isLast && <div className="journey-axis-line" />}
              </div>

              <div className="journey-content-grid">
                <div className="journey-date-cell">
                  <span className="journey-date-text">
                    {entry.date || "Recently"}
                  </span>
                </div>

                <div className="journey-topic-cell">
                  <h4 className="journey-topic-name">{topicName}</h4>
                  {entry.notes && (
                    <span className="journey-notes-excerpt">{entry.notes}</span>
                  )}
                </div>

                <div className="journey-transition-cell">
                  <span className="journey-score-flow">
                    {prev !== undefined ? `${prev}% → ` : ""}
                    <strong className="journey-score-final">{next}%</strong>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="journey-footer-action-row">
        <button
          type="button"
          className="journey-view-history-link"
          onClick={onClearHistory}
        >
          View full history →
        </button>
      </div>
    </div>
  );
}
