export default function RevisionHistory({
  history = [],
  onClearHistory,
}) {
  if (history.length === 0) {
    return (
      <div className="history-empty-card">
        <p>No revision activity logged yet. Complete a topic review to generate your timeline.</p>
      </div>
    );
  }

  return (
    <div className="revision-timeline-module">
      <div className="timeline-header-row">
        <div>
          <span className="timeline-kicker">Chronological Audit</span>
          <h2 className="timeline-title">Revision History</h2>
        </div>
        <div className="timeline-actions-wrap">
          <span className="timeline-count-label">
            {history.length} {history.length === 1 ? "entry" : "entries"} recorded
          </span>
          <button
            type="button"
            className="timeline-clear-btn"
            onClick={onClearHistory}
          >
            Clear History
          </button>
        </div>
      </div>

      <div className="vertical-timeline-container">
        {history.map((entry, index) => (
          <div key={entry.id} className="timeline-entry-row">
            <div className="timeline-track-col">
              <div
                className={`timeline-node-marker ${
                  (entry.newScore || entry.score) >= 75
                    ? "marker-stable"
                    : "marker-decay"
                }`}
              />
              {index < history.length - 1 && (
                <div className="timeline-track-line" />
              )}
            </div>

            <div className="timeline-content-card">
              <div className="timeline-content-top">
                <div className="timeline-date-tag">
                  {entry.date ? entry.date.toUpperCase() : "RECORDED"}
                </div>
                <div className="timeline-score-transition">
                  {entry.oldScore !== undefined && (
                    <span className="score-prev">{entry.oldScore}%</span>
                  )}
                  <span className="score-arrow">→</span>
                  <span className="score-current">
                    {entry.newScore !== undefined ? entry.newScore : entry.score}%
                  </span>
                </div>
              </div>

              <div className="timeline-topic-info">
                <h4 className="timeline-topic-heading">{entry.topic}</h4>
                {entry.subject && (
                  <span className="timeline-subject-tag">{entry.subject}</span>
                )}
              </div>

              {entry.notes && (
                <p className="timeline-notes-text">"{entry.notes}"</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
