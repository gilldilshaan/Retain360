import { useState } from "react";
import ProgressBar from "./ProgressBar";

export default function StrengthShelf({ strongTopics = [], onReviewTopic }) {
  const [activeItemId, setActiveItemId] = useState(null);

  if (strongTopics.length === 0) {
    return (
      <div className="strength-shelf-section">
        <div className="strength-header">
          <span className="strength-kicker">Synaptic Stability</span>
          <h2 className="strength-title">What You Know Well</h2>
          <p className="strength-subtitle">
            No concepts currently meet the 75%+ stability threshold. Practice to build durable memory.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="strength-shelf-section">
      <div className="strength-header">
        <span className="strength-kicker">Synaptic Stability</span>
        <h2 className="strength-title">What You Know Well</h2>
        <p className="strength-subtitle">
          These concepts have achieved durable recall index and high associative connections.
        </p>
      </div>

      <div className="strength-shelf-grid">
        {strongTopics.map((topic) => {
          const isExpanded = activeItemId === topic.id;
          return (
            <div
              key={topic.id}
              className={`strength-shelf-item ${isExpanded ? "expanded" : ""}`}
              onMouseEnter={() => setActiveItemId(topic.id)}
              onMouseLeave={() => setActiveItemId(null)}
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
              <div className="shelf-top-line">
                <span className="shelf-subject-tag">{topic.subject}</span>
                <span className="shelf-strength-pct">{topic.retention}%</span>
              </div>

              <h3 className="shelf-topic-title">{topic.name}</h3>

              <div className="shelf-bar-wrap">
                <ProgressBar value={topic.retention} height={4} color="#798165" />
              </div>

              <div className="shelf-meta-revealer">
                <span className="shelf-meta-text">
                  Revised {topic.lastRevised}
                </span>
                <span className="shelf-confidence-badge">
                  {topic.confidence || "Stable Recall"}
                </span>
              </div>

              {topic.connectedTo && topic.connectedTo.length > 0 && (
                <div className="shelf-related-tags">
                  <span className="related-label">Links:</span>
                  {topic.connectedTo.slice(0, 2).map((rel) => (
                    <span key={rel} className="related-tag-pill">
                      {rel}
                    </span>
                  ))}
                </div>
              )}

              <button
                type="button"
                className="shelf-review-trigger"
                onClick={(e) => {
                  e.stopPropagation();
                  onReviewTopic(topic);
                }}
              >
                Review anyway →
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
