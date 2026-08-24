export default function MemoryJourney({ history = [], onClearHistory }) {
  const defaultHistory = [
    {
      id: "h1",
      date: "Today, 10:42 AM",
      topic: "Python Functions",
      notes: "Quick check",
      oldScore: 42,
      newScore: 91,
    },
    {
      id: "h2",
      date: "2 days ago",
      topic: "Neural Networks",
      notes: "Active recall practice",
      oldScore: 68,
      newScore: 83,
    },
    {
      id: "h3",
      date: "5 days ago",
      topic: "SQL Joins",
      notes: "Solved transformation matrix practice problems.",
      oldScore: 62,
      newScore: 76,
    },
  ];

  const items = history.length > 0 ? history : defaultHistory;

  return (
    <div className="exact-journey-card-panel">
      <div className="journey-header-block">
        <h2 className="journey-panel-title">YOUR MEMORY JOURNEY</h2>
        <p className="journey-panel-subtitle">
          Recent revision events and retention trajectory.
        </p>
      </div>

      <div className="journey-timeline-list">
        {items.map((entry, index) => {
          const isLast = index === items.length - 1;
          const prev =
            entry.previousRetention !== undefined
              ? entry.previousRetention
              : entry.oldScore;
          const curr =
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
                <span className="journey-date-text">{entry.date || "Recently"}</span>
                <div>
                  <h3 className="journey-topic-name">{entry.topicName || entry.topic}</h3>
                  {entry.notes && (
                    <span className="journey-notes-excerpt">"{entry.notes}"</span>
                  )}
                </div>
                <div className="journey-score-flow">
                  {prev !== undefined ? `${prev}% → ` : ""}
                  <span className="journey-score-final">{curr}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          type="button"
          className="journey-view-history-link"
          onClick={() => {
            const el = document.getElementById("topic-explorer");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        >
          View full history →
        </button>

        {history.length > 0 && (
          <button
            type="button"
            className="journey-view-history-link"
            style={{ color: "#96584E" }}
            onClick={onClearHistory}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
