export default function SmartInsight({
  insightHeadline,
  recommendedTopic,
  onStartRecommendedReview,
}) {
  const targetTopic = recommendedTopic || {
    name: "Probability",
    subject: "Mathematics",
    retention: 48,
  };

  const estimatedImpact = Math.max(
    Math.round((90 - targetTopic.retention) / 5),
    8
  );

  return (
    <div className="exact-smart-insight-card-panel">
      <div className="smart-insight-bg-particles">
        <svg viewBox="0 0 400 300" className="insight-particles-svg">
          <path
            d="M0,180 Q100,100 200,190 T400,140"
            fill="none"
            stroke="rgba(198, 146, 85, 0.2)"
            strokeWidth="1.5"
            strokeDasharray="4 6"
          />
          <path
            d="M0,220 Q150,140 280,240 T400,180"
            fill="none"
            stroke="rgba(200, 109, 81, 0.15)"
            strokeWidth="1.2"
          />
          <circle cx="120" cy="140" r="1.5" fill="#C69255" opacity="0.6" />
          <circle cx="280" cy="190" r="2" fill="#FAF7F1" opacity="0.4" />
        </svg>
      </div>

      <div className="insight-inner-content">
        <div className="insight-header-line">
          <span style={{ color: "#C69255" }}>✦</span>
          <span className="insight-gold-kicker">SMART INSIGHT</span>
        </div>

        <h3 className="insight-editorial-headline">
          {insightHeadline ||
            "You are strongest in AI / ML, but Mathematics is currently limiting your overall knowledge health."}
        </h3>

        <div className="next-best-action-wrapper">
          <span className="next-action-small-kicker">NEXT BEST ACTION</span>
          <div className="next-action-white-card">
            <h4 className="action-card-title">Revise {targetTopic.name}</h4>
            <span className="action-card-impact">
              Estimated impact: +{estimatedImpact}% knowledge health
            </span>
          </div>

          <button
            type="button"
            className="start-recommended-filled-btn"
            onClick={() => onStartRecommendedReview(targetTopic)}
          >
            <span>⚡</span>
            <span>Start Recommended Review</span>
          </button>
        </div>
      </div>
    </div>
  );
}
