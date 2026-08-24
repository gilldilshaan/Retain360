import ProgressBar from "./ProgressBar";

export default function TopicCard({ topic, onReviewTopic }) {
  const getStatusBadge = (status, retention) => {
    if (status === "needs-revision" || retention < 60) {
      return { label: "Fading", className: "badge-fading" };
    }
    if (status === "strong" || retention >= 75) {
      return { label: "Strong", className: "badge-strong" };
    }
    return { label: "Active", className: "badge-active" };
  };

  const badge = getStatusBadge(topic.status, topic.retention);

  return (
    <div className={`explorer-topic-item ${badge.className}-border`}>
      <div className="explorer-item-top">
        <span className={`explorer-status-tag ${badge.className}`}>
          {badge.label}
        </span>
        <span className="explorer-subject-name">{topic.subject}</span>
      </div>

      <div className="explorer-item-body">
        <h4 className="explorer-topic-title">{topic.name}</h4>
        <div className="explorer-score-row">
          <span className="explorer-retention-num">{topic.retention}%</span>
          <span className="explorer-trend-indicator">{topic.trend || "Stable"}</span>
        </div>
      </div>

      <div className="explorer-meter-bar">
        <ProgressBar value={topic.retention} height={3} />
      </div>

      <div className="explorer-item-bottom">
        <span className="explorer-revised-stamp">
          Revised {topic.lastRevised}
        </span>
        <button
          type="button"
          className="explorer-review-btn"
          onClick={() => onReviewTopic(topic)}
        >
          Review →
        </button>
      </div>
    </div>
  );
}
