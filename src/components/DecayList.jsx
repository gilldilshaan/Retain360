export default function DecayList({ fadingTopics = [], onReviewTopic }) {
  if (fadingTopics.length === 0) {
    return (
      <div className="decay-section-dark">
        <div className="decay-header">
          <span className="decay-kicker">Active Recall Vulnerability</span>
          <h2 className="decay-title">What's Fading</h2>
          <p className="decay-subtitle">
            All tracked concepts are currently above critical memory decay thresholds.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="decay-section-dark">
      <div className="decay-header">
        <span className="decay-kicker">Active Recall Vulnerability</span>
        <h2 className="decay-title">What's Fading</h2>
        <p className="decay-subtitle">
          These concepts are becoming harder to recall and require immediate spaced repetition.
        </p>
      </div>

      <div className="decay-ranked-list">
        {fadingTopics.map((topic, index) => {
          const rank = String(index + 1).padStart(2, "0");
          const isHighestRisk = index === 0;
          const riskLabel =
            topic.retention <= 45
              ? "HIGH DECAY RISK"
              : topic.retention <= 55
              ? "MEDIUM DECAY RISK"
              : "DECAY RISK";

          return (
            <div
              key={topic.id}
              className={`decay-row-item ${isHighestRisk ? "highest-risk" : ""}`}
            >
              <div className="decay-rank-col">
                <span className="decay-rank-num">{rank}</span>
              </div>

              <div className="decay-identity-col">
                <span className="decay-subject-tag">{topic.subject}</span>
                <h3 className="decay-topic-name">{topic.name}</h3>
                <span className="decay-revised-text">
                  Last revised {topic.lastRevised}
                </span>
              </div>

              <div className="decay-metrics-col">
                <span className="decay-percentage">{topic.retention}%</span>
                <span className="decay-risk-pill">{riskLabel}</span>
              </div>

              <div className="decay-action-col">
                <button
                  type="button"
                  className="decay-review-action"
                  onClick={() => onReviewTopic(topic)}
                >
                  Review
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
