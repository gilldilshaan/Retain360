export default function RevisionIntelligence({
  priorities = [],
  onReviewTopic,
}) {
  if (priorities.length === 0) {
    return null;
  }

  const getPriorityTagClass = (level) => {
    if (level === "VERY HIGH") return "priority-very-high";
    if (level === "HIGH") return "priority-high";
    return "priority-medium";
  };

  return (
    <div className="revision-intelligence-card">
      <div className="intelligence-header">
        <div>
          <span className="intelligence-kicker">Algorithmic Scheduling</span>
          <h2 className="intelligence-title">Revision Intelligence</h2>
        </div>
        <span className="intelligence-meta-count">
          {priorities.length} Action Items
        </span>
      </div>

      <div className="intelligence-items-grid">
        {priorities.map((item) => (
          <div key={item.id} className="intelligence-row">
            <div className="intelligence-left">
              <div className="intelligence-tags">
                <span
                  className={`priority-level-badge ${getPriorityTagClass(
                    item.priorityLevel
                  )}`}
                >
                  {item.priorityLevel} PRIORITY
                </span>
                <span className="intelligence-subject">{item.subject}</span>
              </div>
              <h3 className="intelligence-topic-title">{item.name}</h3>
              <span className="intelligence-timing">
                {item.retention}% retention · Last revised {item.lastRevised}
              </span>
            </div>

            <div className="intelligence-right">
              <button
                type="button"
                className="intelligence-action-btn"
                onClick={() => onReviewTopic(item)}
              >
                Review Topic →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
