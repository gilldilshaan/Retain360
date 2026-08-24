import { useRef } from "react";

export default function StrongKnowledge({
  strongTopics = [],
  onReviewTopic,
}) {
  const scrollRef = useRef(null);

  const handleScroll = (dir) => {
    if (scrollRef.current) {
      const scrollDist = dir === "left" ? -240 : 240;
      scrollRef.current.scrollBy({ left: scrollDist, behavior: "smooth" });
    }
  };

  const displayTopics = strongTopics.slice(0, 4);

  const renderStrongSparkline = () => (
    <svg viewBox="0 0 100 24" className="strong-sparkline-svg">
      <path
        d="M0,18 Q20,10 40,14 T75,6 T100,8"
        fill="none"
        stroke="#798165"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="40" cy="14" r="2" fill="#798165" />
      <circle cx="75" cy="6" r="2" fill="#798165" />
      <circle cx="98" cy="8" r="2.5" fill="#798165" />
    </svg>
  );

  return (
    <section className="exact-strong-section">
      <div className="strong-header-bar">
        <div className="strong-icon-title-group">
          <span style={{ color: "#798165", fontSize: "14px" }}>★</span>
          <div>
            <h2 className="strong-section-heading">STRONG KNOWLEDGE</h2>
            <p className="strong-section-sub">
              Topics with retention ≥ 75% that are well-maintained.
            </p>
          </div>
        </div>

        <div className="strong-nav-actions">
          <button
            type="button"
            className="view-all-strong-link-btn"
            onClick={() => {
              const el = document.getElementById("topic-explorer");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            View all strong topics →
          </button>
          <div className="strong-arrow-buttons">
            <button
              type="button"
              className="strong-circle-arrow"
              onClick={() => handleScroll("left")}
              aria-label="Scroll left"
            >
              ←
            </button>
            <button
              type="button"
              className="strong-circle-arrow"
              onClick={() => handleScroll("right")}
              aria-label="Scroll right"
            >
              →
            </button>
          </div>
        </div>
      </div>

      <div className="strong-cards-scroll-container" ref={scrollRef}>
        <div className="strong-cards-flex-track">
          {displayTopics.map((topic) => (
            <div
              key={topic.id}
              className="strong-single-card"
              onClick={() => onReviewTopic(topic)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onReviewTopic(topic);
                }
              }}
            >
              <div className="strong-card-top-line">
                <div>
                  <h3 className="strong-topic-title-text">{topic.name}</h3>
                  <span className="strong-domain-label">{topic.subject}</span>
                </div>
                <span className="strong-card-star-badge">⭐</span>
              </div>

              <div className="strong-card-middle-flow">
                <div className="strong-sparkline-box">
                  {renderStrongSparkline()}
                </div>
                <span className="strong-card-percentage-num">{topic.retention}%</span>
              </div>

              <div className="strong-card-bottom-line">
                <span>Last revised {topic.lastRevised}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
