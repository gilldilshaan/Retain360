import { useState, useEffect } from "react";

export default function RevisionPanel({
  topic,
  isOpen,
  onClose,
  onSaveRevision,
}) {
  const [score, setScore] = useState(topic ? topic.retention : 50);
  const [notes, setNotes] = useState("");
  const [successState, setSuccessState] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !topic) return null;

  const presets = [
    { label: "Struggled (45%)", value: 45 },
    { label: "Moderate (75%)", value: 75 },
    { label: "Mastered (95%)", value: 95 },
  ];

  const diff = score - topic.retention;
  const changeLabel =
    diff === 0 ? "No change" : diff > 0 ? `+${diff}% gain` : `${diff}% drop`;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessState({
      oldScore: topic.retention,
      newScore: score,
      topicName: topic.name,
    });
    onSaveRevision(topic.id, score, notes.trim());
  };

  return (
    <div
      className="revision-modal-backdrop-anim"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="revision-modal-dialog-card"
        onClick={(e) => e.stopPropagation()}
      >
        {successState ? (
          <div className="revision-success-celebration">
            <div className="success-pulse-check">✓</div>
            <span className="success-kicker-anim">REVISION RECORDED</span>
            <h3 className="success-title-anim">Memory Synchronized</h3>
            <span className="success-topic-badge">{successState.topicName}</span>

            <div className="success-score-flow-pill">
              <span className="score-old">{successState.oldScore}%</span>
              <span className="score-arrow">→</span>
              <span className="score-new">{successState.newScore}%</span>
            </div>

            <p className="success-subtext-anim">
              Knowledge health index and longitudinal retention curves updated.
            </p>

            <button
              type="button"
              className="success-done-btn"
              onClick={onClose}
            >
              Continue
            </button>
          </div>
        ) : (
          <div className="modal-inner-flow">
            <div className="modal-top-row">
              <span className="modal-subject-pill">{topic.subject.toUpperCase()}</span>
              <button
                type="button"
                className="modal-close-cross"
                onClick={onClose}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <h2 className="modal-topic-heading">{topic.name}</h2>
            <p className="modal-topic-sub-caption">
              Log your revision session to update retention and maintain active recall.
            </p>

            <form onSubmit={handleSubmit} className="modal-form-fields">
              <div className="new-score-preview-box">
                <div className="score-preview-top">
                  <span className="score-preview-label">NEW RETENTION SCORE</span>
                  <div className="score-preview-diff-info">
                    <span className="score-prev-hint">Previous: {topic.retention}%</span>
                    <span className={`diff-pill ${diff > 0 ? "gain" : diff < 0 ? "drop" : "neutral"}`}>
                      {changeLabel}
                    </span>
                  </div>
                </div>

                <div className="score-preview-numeral-row">
                  <span className="score-preview-large-num">{score}%</span>
                </div>

                <div className="score-meter-bar-track">
                  <div
                    className="score-meter-bar-fill"
                    style={{
                      width: `${score}%`,
                      backgroundColor: score < 60 ? "#96584E" : score < 75 ? "#8C6046" : "#798165",
                    }}
                  />
                </div>
              </div>

              <div className="slider-control-block">
                <div className="slider-control-header">
                  <span className="slider-label-bold">Adjust Recall Level</span>
                  <span className="slider-hint-muted">Slide to match your confidence</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="interactive-retention-slider"
                />
              </div>

              <div className="quick-presets-section">
                <span className="presets-header-title">Quick Presets:</span>
                <div className="presets-button-row">
                  {presets.map((p) => {
                    const isSelected = score === p.value;
                    return (
                      <button
                        key={p.label}
                        type="button"
                        className={`preset-pill-btn ${isSelected ? "preset-active" : ""}`}
                        onClick={() => setScore(p.value)}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="notes-textarea-group">
                <label htmlFor="modal-notes-input" className="notes-field-title">
                  Revision Notes (Optional)
                </label>
                <textarea
                  id="modal-notes-input"
                  rows={3}
                  className="modal-notes-textarea"
                  placeholder="e.g. Practiced 5 practice problems, reviewed key formulas, solved edge cases..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="modal-action-buttons-row">
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modal-submit-save-btn"
                >
                  Complete Revision & Save
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
