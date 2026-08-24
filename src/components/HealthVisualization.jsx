import { useState } from "react";

export default function HealthVisualization({
  overallHealth = 69,
  subjectStats = [],
  selectedSubject = "all",
  onSelectSubject,
}) {
  const [hoveredSubject, setHoveredSubject] = useState(null);

  const radius = 96;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const gap = 12;
  const totalSegments = subjectStats.length || 4;
  const segmentLength = (circumference - gap * totalSegments) / totalSegments;

  const activeSubject = hoveredSubject || {
    name: "Knowledge Health",
    retention: overallHealth,
    topics: subjectStats.reduce((acc, s) => acc + s.topics, 0),
    isOverall: true,
  };

  const getSubjectColor = (subjName, retention) => {
    if (subjName === "Mathematics") return "#96584E";
    if (subjName === "Programming") return "#8C6046";
    if (subjName === "DBMS") return "#C69255";
    if (subjName === "AI / ML") return "#798165";
    if (retention >= 75) return "#798165";
    if (retention >= 60) return "#8C6046";
    return "#96584E";
  };

  return (
    <div className="health-visual-root">
      <div className="health-visual-svg-wrapper">
        <svg
          viewBox="0 0 260 260"
          className="health-visual-svg"
          aria-label="Knowledge Health circular metric"
        >
          <circle
            cx="130"
            cy="130"
            r={radius}
            fill="none"
            stroke="rgba(44, 39, 37, 0.08)"
            strokeWidth={strokeWidth}
          />

          {subjectStats.map((subj, index) => {
            const offset = index * (segmentLength + gap);
            const isHovered = hoveredSubject?.name === subj.name;
            const isSelected = selectedSubject === subj.name;
            const color = getSubjectColor(subj.name, subj.retention);

            return (
              <circle
                key={subj.name}
                cx="130"
                cy="130"
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth={isHovered || isSelected ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
                className="health-arc-path"
                style={{
                  transform: "rotate(-90deg)",
                  transformOrigin: "center",
                  cursor: "pointer",
                }}
                onMouseEnter={() => setHoveredSubject(subj)}
                onMouseLeave={() => setHoveredSubject(null)}
                onClick={() => onSelectSubject(subj.name)}
              />
            );
          })}
        </svg>

        <div className="health-center-readout">
          <span className="health-center-pct">{activeSubject.retention}%</span>
          <span className="health-center-label">
            {activeSubject.isOverall ? "KNOWLEDGE HEALTH" : activeSubject.name.toUpperCase()}
          </span>
          <span className="health-center-sub">
            {activeSubject.isOverall
              ? overallHealth >= 75
                ? "Optimal Stability"
                : "Attention Needed"
              : `${activeSubject.topics} concepts`}
          </span>
        </div>
      </div>

      <div className="health-subject-legend">
        {subjectStats.map((subj) => {
          const isSelected = selectedSubject === subj.name;
          const color = getSubjectColor(subj.name, subj.retention);
          return (
            <button
              key={subj.name}
              type="button"
              className={`health-legend-item ${isSelected ? "legend-active" : ""}`}
              onMouseEnter={() => setHoveredSubject(subj)}
              onMouseLeave={() => setHoveredSubject(null)}
              onClick={() => onSelectSubject(subj.name)}
            >
              <span className="legend-swatch-dot" style={{ backgroundColor: color }} />
              <span className="legend-subject-name">{subj.name}</span>
              <span className="legend-subject-pct">{subj.retention}%</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
