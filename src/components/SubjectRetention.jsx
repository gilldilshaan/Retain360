import ProgressBar from "./ProgressBar";

export default function SubjectRetention({
  subjects = [],
  selectedSubject = "all",
  onSelectSubject,
}) {
  return (
    <div className="subject-retention-container">
      <div className="subject-retention-list">
        {subjects.map((subject) => {
          const isSelected = selectedSubject === subject.name;
          return (
            <div
              key={subject.name}
              className={`subject-row-item ${isSelected ? "selected" : ""}`}
              onClick={() => onSelectSubject(subject.name)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectSubject(subject.name);
                }
              }}
            >
              <div className="subject-row-meta">
                <div className="subject-row-title-wrap">
                  <span className="subject-row-name">{subject.name}</span>
                  <span className="subject-row-count">
                    {subject.topics} {subject.topics === 1 ? "topic" : "topics"}
                  </span>
                </div>
                <div className="subject-row-score">
                  <span className="subject-score-number">{subject.retention}%</span>
                  <span className="subject-filter-indicator">
                    {isSelected ? "Filtered" : "Filter"}
                  </span>
                </div>
              </div>

              <ProgressBar value={subject.retention} height={4} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
