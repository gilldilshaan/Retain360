import ProgressBar from "./ProgressBar";

export default function SubjectCard({
  name,
  retention,
  topicCount,
  isSelected,
  onSelect,
}) {
  return (
    <div
      className={`subject-card ${isSelected ? "selected" : ""}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <div className="subject-header">
        <div className="subject-info">
          <span className="subject-kicker">Domain</span>
          <h3 className="subject-name">{name}</h3>
        </div>
        <div className="subject-metric">
          <span className="subject-retention-val">{retention}%</span>
          <span className="subject-metric-label">Retention</span>
        </div>
      </div>

      <div className="subject-bar-wrap">
        <ProgressBar value={retention} height={4} />
      </div>

      <div className="subject-footer">
        <span className="subject-topic-count">
          {topicCount} {topicCount === 1 ? "topic" : "topics"}
        </span>
        <span className="subject-state-tag">
          {isSelected ? "Filtered" : "Filter"}
        </span>
      </div>
    </div>
  );
}
