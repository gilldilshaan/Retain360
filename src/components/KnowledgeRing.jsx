import { useState } from "react";

export default function KnowledgeRing({
  overallHealth = 69,
  subjectStats = [],
  selectedSubject = "all",
  onSelectSubject,
}) {
  const [hoveredSubject, setHoveredSubject] = useState(null);

  const radius = 86;
  const strokeWidth = 11;
  const circumference = 2 * Math.PI * radius;
  const gap = 12;
  const totalSegments = subjectStats.length || 4;
  const segmentLength = (circumference - gap * totalSegments) / totalSegments;

  const activeSubject = hoveredSubject || {
    name: "KNOWLEDGE HEALTH",
    retention: overallHealth,
    topics: subjectStats.reduce((acc, s) => acc + s.topics, 0),
    isOverall: true,
  };

  const getSubjectColor = (subjName, retention) => {
    if (subjName === "Mathematics") return "#798165";
    if (subjName === "Programming") return "#96584E";
    if (subjName === "DBMS") return "#C69255";
    if (subjName === "AI / ML") return "#798165";
    if (retention >= 75) return "#798165";
    if (retention >= 60) return "#C69255";
    return "#96584E";
  };

  return (
    <div className="hero-cosmic-ring-panel">
      <div className="particle-waves-background">
        <svg viewBox="0 0 400 300" className="particle-waves-svg">
          <path
            d="M0,120 Q100,60 200,140 T400,100"
            fill="none"
            stroke="rgba(198, 146, 85, 0.15)"
            strokeWidth="1.5"
            strokeDasharray="4 6"
          />
          <path
            d="M0,160 Q120,220 240,130 T400,180"
            fill="none"
            stroke="rgba(140, 96, 70, 0.18)"
            strokeWidth="1.2"
          />
          <path
            d="M0,80 Q150,150 280,70 T400,140"
            fill="none"
            stroke="rgba(121, 129, 101, 0.15)"
            strokeWidth="1.2"
          />
          <circle cx="180" cy="90" r="1.5" fill="#C69255" opacity="0.6" />
          <circle cx="260" cy="170" r="2" fill="#FAF7F1" opacity="0.4" />
          <circle cx="320" cy="110" r="1" fill="#C86D51" opacity="0.7" />
        </svg>
      </div>

      <div className="ring-and-legend-container">
        <div className="cosmic-ring-visual">
          <svg
            viewBox="0 0 240 240"
            className="cosmic-ring-svg"
            aria-label="Knowledge Health circular metric"
          >
            <circle
              cx="120"
              cy="120"
              r={radius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.06)"
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
                  cx="120"
                  cy="120"
                  r={radius}
                  fill="none"
                  stroke={color}
                  strokeWidth={isHovered || isSelected ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="round"
                  className="cosmic-arc-path"
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

          <div className="cosmic-ring-center">
            <span className="cosmic-percentage-num">{activeSubject.retention}%</span>
            <span className="cosmic-center-label">
              {activeSubject.isOverall ? "KNOWLEDGE HEALTH" : activeSubject.name.toUpperCase()}
            </span>
            <span className="cosmic-status-pill">
              {activeSubject.isOverall
                ? overallHealth >= 75
                  ? "OPTIMAL STABILITY"
                  : "ATTENTION NEEDED"
                : `${activeSubject.topics} CONCEPTS`}
            </span>
          </div>
        </div>

        <div className="cosmic-subjects-list">
          {subjectStats.map((subj) => {
            const isSelected = selectedSubject === subj.name;
            const color = getSubjectColor(subj.name, subj.retention);

            return (
              <button
                key={subj.name}
                type="button"
                className={`cosmic-subject-row ${isSelected ? "active-row" : ""}`}
                onMouseEnter={() => setHoveredSubject(subj)}
                onMouseLeave={() => setHoveredSubject(null)}
                onClick={() => onSelectSubject(subj.name)}
              >
                <div className="cosmic-subj-left">
                  <span className="cosmic-dot" style={{ backgroundColor: color }} />
                  <span>{subj.name}</span>
                </div>
                <span className="cosmic-subj-pct">{subj.retention}%</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
