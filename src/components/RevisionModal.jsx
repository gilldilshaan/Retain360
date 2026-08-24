import { useState, useEffect } from "react";
import ProgressBar from "./ProgressBar";

export default function RevisionModal({ topic, onClose, onSaveRevision }) {
  const [score, setScore] = useState(topic ? topic.retention : 50);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!topic) return null;

  const scoreChange = score - topic.retention;

  const confidencePresets = [
    { label: "Struggling", value: 45, desc: "Significant decay" },
    { label: "Getting there", value: 65, desc: "Partial recall" },
    { label: "Confident", value: 80, desc: "Solid conceptual grasp" },
    { label: "Mastered", value: 95, desc: "Instant active recall" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveRevision(topic.id, Number(score), notes.trim());
  };

  return (
    <div
      className="revision-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="editorial-revision-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header-row">
          <div className="dialog-domain-wrap">
            <span className="dialog-domain-tag">{topic.subject}</span>
            <span className="dialog-divider">/</span>
            <span className="dialog-session-label">Active Recall Assessment</span>
          </div>
          <button
            type="button"
            className="dialog-close-button"
            onClick={onClose}
            aria-label="Close revision dialog"
          >
            ✕
          </button>
        </div>

        <div className="dialog-topic-hero">
          <h2 className="dialog-topic-headline">{topic.name}</h2>
          <div className="dialog-baseline-badge">
            <span className="baseline-label">Current Retention:</span>
            <strong className="baseline-num">{topic.retention}%</strong>
            <span className="baseline-dot">·</span>
            <span className="baseline-revised">Last revised {topic.lastRevised}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="dialog-form">
          <div className="recall-assessment-block">
            <div className="recall-block-header">
              <span className="recall-kicker">YOUR RECALL</span>
              <h3 className="recall-prompt-text">
                How well can you recall this topic right now?
              </h3>
            </div>

            <div className="confidence-presets-grid">
              {confidencePresets.map((preset) => {
                const isActive = score === preset.value;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    className={`confidence-preset-btn ${isActive ? "active" : ""}`}
                    onClick={() => setScore(preset.value)}
                  >
                    <span className="preset-name">{preset.label}</span>
                    <span className="preset-score">{preset.value}%</span>
                    <span className="preset-desc">{preset.desc}</span>
                  </button>
                );
              })}
            </div>

            <div className="fine-adjustment-section">
              <div className="fine-adjust-header">
                <label htmlFor="fine-slider" className="fine-adjust-label">
                  Fine Adjustment Slider
                </label>
                <div className="fine-value-badge">
                  <span>{score}%</span>
                </div>
              </div>
              <input
                id="fine-slider"
                type="range"
                min="0"
                max="100"
                step="1"
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="editorial-precision-slider"
              />
              <div className="slider-meter-preview">
                <ProgressBar value={score} height={4} />
              </div>
            </div>
          </div>

          <div className="form-notes-block">
            <label htmlFor="revision-notes-area" className="notes-field-label">
              Revision Notes
            </label>
            <textarea
              id="revision-notes-area"
              rows={3}
              className="notes-textarea-input"
              placeholder="e.g. Reviewed pointer arithmetic and solved 4 practice problems."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="revision-projection-strip">
            <div className="projection-col">
              <span className="projection-label">After this revision</span>
              <span className="projection-headline">
                New retention: <strong className="projection-num">{score}%</strong>
              </span>
            </div>
            <div className="projection-change-col">
              <span
                className={`projection-delta-badge ${
                  scoreChange > 0
                    ? "delta-positive"
                    : scoreChange < 0
                    ? "delta-negative"
                    : ""
                }`}
              >
                Change: {scoreChange > 0 ? `+${scoreChange}%` : `${scoreChange}%`}
              </span>
            </div>
          </div>

          <div className="dialog-action-buttons">
            <button
              type="button"
              className="dialog-cancel-action"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="dialog-submit-action"
            >
              Complete Revision
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
