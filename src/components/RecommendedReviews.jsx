export default function RecommendedReviews({
  recommendations = [],
  onReview,
}) {
  if (recommendations.length === 0) {
    return (
      <div className="recommendations-empty">
        <p>No critical decay warnings. All monitored topics are currently within stable retention limits.</p>
      </div>
    );
  }

  return (
    <div className="recommendations-panel">
      <div className="recommendations-header">
        <div>
          <span className="card-kicker">Algorithmic Queue</span>
          <h3 className="panel-title">Recommended Actions</h3>
        </div>
        <span className="queue-badge">
          {recommendations.length} {recommendations.length === 1 ? "priority item" : "priority items"}
        </span>
      </div>

      <div className="recommendations-grid">
        {recommendations.map((rec, index) => (
          <div key={rec.id} className="rec-card">
            <div className="rec-top">
              <div className="rec-priority-tag">
                <span className="priority-rank">#{index + 1} Priority</span>
                <span className="rec-subject">{rec.subject}</span>
              </div>
              <span className="rec-score-pill">{rec.retention}%</span>
            </div>

            <h4 className="rec-topic-name">{rec.name}</h4>

            <p className="rec-reason">
              {rec.retention}% retention · {rec.lastRevised}
            </p>

            <button
              type="button"
              className="rec-action-btn"
              onClick={() => onReview(rec)}
            >
              Review Topic →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
