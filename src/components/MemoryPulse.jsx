import { useState, useRef } from "react";

export default function MemoryPulse({ topics = [], onReviewTopic }) {
  const [activeTopicId, setActiveTopicId] = useState(3); // Default to Normalization (id 3)
  const scrollTrackRef = useRef(null);

  const handleScroll = (dir) => {
    if (scrollTrackRef.current) {
      const scrollDist = dir === "left" ? -240 : 240;
      scrollTrackRef.current.scrollBy({ left: scrollDist, behavior: "smooth" });
    }
  };

  const getRetentionColor = (retention) => {
    if (retention < 60) return "#96584E";
    if (retention < 75) return "#C69255";
    return "#798165";
  };

  const renderSparkline = (retention, color) => {
    let pathD;
    if (retention < 50) {
      pathD = "M0,15 Q25,28 50,18 T100,26 T140,20 T180,28";
    } else if (retention < 70) {
      pathD = "M0,24 Q30,12 60,22 T110,14 T150,20 T180,10";
    } else {
      pathD = "M0,26 Q25,18 55,22 T105,12 T145,16 T180,6";
    }

    return (
      <svg viewBox="0 0 180 32" className="pulse-sparkline-svg">
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="50" cy="18" r="2.5" fill={color} />
        <circle cx="100" cy="26" r="2.5" fill={color} />
        <circle cx="140" cy="20" r="2.5" fill={color} />
      </svg>
    );
  };

  return (
    <section className="exact-pulse-section">
      <div className="pulse-header-row">
        <div>
          <div className="pulse-kicker-line">
            <span style={{ color: "#C69255", fontSize: "11px" }}>▲</span>
            <span className="pulse-kicker-text">MEMORY PULSE</span>
          </div>
          <p className="pulse-sub-text">
            See how your knowledge is distributed across topics.
          </p>
        </div>

        <div className="pulse-nav-controls">
          <span className="pulse-drag-hint">Drag to explore</span>
          <button
            type="button"
            className="pulse-circle-btn"
            onClick={() => handleScroll("left")}
            aria-label="Scroll left"
          >
            ←
          </button>
          <button
            type="button"
            className="pulse-circle-btn"
            onClick={() => handleScroll("right")}
            aria-label="Scroll right"
          >
            →
          </button>
        </div>
      </div>

      <div className="pulse-cards-scroll-track" ref={scrollTrackRef}>
        <div className="pulse-cards-flex-row">
          {topics.map((topic) => {
            const isGlowActive = activeTopicId === topic.id;
            const strokeColor = getRetentionColor(topic.retention);

            return (
              <div
                key={topic.id}
                className={`pulse-exact-card ${isGlowActive ? "card-glow-active" : ""}`}
                onClick={() => {
                  setActiveTopicId(topic.id);
                  if (onReviewTopic) onReviewTopic(topic);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveTopicId(topic.id);
                    if (onReviewTopic) onReviewTopic(topic);
                  }
                }}
              >
                <div className="card-top-info">
                  <h3 className="card-topic-title">{topic.name}</h3>
                  <span className="card-subject-subtitle">{topic.subject}</span>
                </div>

                <div className="card-score-big">{topic.retention}%</div>

                <div className="card-sparkline-area">
                  {renderSparkline(topic.retention, strokeColor)}
                </div>

                <div className="card-bottom-indicator-bar">
                  <div
                    className="bar-fill-segment"
                    style={{
                      width: `${topic.retention}%`,
                      backgroundColor: strokeColor,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pulse-bottom-legend-row">
        <div className="legend-entry">
          <span className="legend-dot dot-decay" />
          <span className="legend-entry-text">High Decay (&lt;60%)</span>
        </div>
        <div className="legend-entry">
          <span className="legend-dot dot-active" />
          <span className="legend-entry-text">Active Recall (60-74%)</span>
        </div>
        <div className="legend-entry">
          <span className="legend-dot dot-strong" />
          <span className="legend-entry-text">Retained (≥75%)</span>
        </div>
      </div>
    </section>
  );
}
