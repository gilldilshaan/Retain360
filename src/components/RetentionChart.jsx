import { useState } from "react";

export default function RetentionChart({ overallHealth = 76, topicsCount = 8 }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const trendData = [
    { label: "W1", value: Math.max(overallHealth - 12, 45) },
    { label: "W2", value: Math.max(overallHealth - 9, 50) },
    { label: "W3", value: Math.max(overallHealth - 5, 54) },
    { label: "W4", value: Math.max(overallHealth - 8, 58) },
    { label: "W5", value: Math.max(overallHealth - 3, 65) },
    { label: "W6", value: Math.max(overallHealth - 1, 70) },
    { label: "Current", value: overallHealth },
  ];

  const width = 580;
  const height = 180;
  const paddingX = 40;
  const paddingY = 25;

  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  const points = trendData.map((d, index) => {
    const x = paddingX + (index / (trendData.length - 1)) * chartW;
    const y = height - paddingY - (d.value / 100) * chartH;
    return { ...d, x, y };
  });

  const pathD = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className="analytics-card">
      <div className="analytics-card-header">
        <div>
          <span className="card-kicker">Retention Analytics</span>
          <h3 className="analytics-title">Knowledge Retention Trajectory</h3>
        </div>
        <div className="analytics-legend">
          <span className="legend-item">
            <span className="legend-dot dot-trend" /> Cohort Retention Trend
          </span>
          <span className="legend-item">
            <span className="legend-dot dot-benchmark" /> Target Threshold (80%)
          </span>
        </div>
      </div>

      <div className="analytics-visual-wrap">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="retention-svg-chart"
          preserveAspectRatio="none"
        >
          <line
            x1={paddingX}
            y1={paddingY}
            x2={width - paddingX}
            y2={paddingY}
            stroke="rgba(44, 39, 37, 0.08)"
            strokeDasharray="3 3"
          />
          <text x={paddingX - 10} y={paddingY + 4} textAnchor="end" className="chart-axis-text">
            100%
          </text>

          <line
            x1={paddingX}
            y1={paddingY + chartH * 0.2}
            x2={width - paddingX}
            y2={paddingY + chartH * 0.2}
            stroke="rgba(121, 129, 101, 0.35)"
            strokeDasharray="4 4"
          />
          <text x={paddingX - 10} y={paddingY + chartH * 0.2 + 4} textAnchor="end" className="chart-axis-text benchmark-text">
            80%
          </text>

          <line
            x1={paddingX}
            y1={paddingY + chartH * 0.5}
            x2={width - paddingX}
            y2={paddingY + chartH * 0.5}
            stroke="rgba(44, 39, 37, 0.08)"
            strokeDasharray="3 3"
          />
          <text x={paddingX - 10} y={paddingY + chartH * 0.5 + 4} textAnchor="end" className="chart-axis-text">
            50%
          </text>

          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="rgba(44, 39, 37, 0.15)"
          />

          <path d={areaD} fill="rgba(140, 96, 70, 0.08)" />

          <path
            d={pathD}
            fill="none"
            stroke="#8C6046"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((p, i) => (
            <g key={p.label}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredPoint === i ? "5.5" : "3.5"}
                fill="#FAF4EA"
                stroke="#8C6046"
                strokeWidth="2"
                className="chart-data-dot"
                onMouseEnter={() => setHoveredPoint(i)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              <text
                x={p.x}
                y={height - 6}
                textAnchor="middle"
                className="chart-axis-text"
              >
                {p.label}
              </text>
            </g>
          ))}
        </svg>

        {hoveredPoint !== null && (
          <div
            className="chart-tooltip"
            style={{
              left: `${(points[hoveredPoint].x / width) * 100}%`,
              top: `${(points[hoveredPoint].y / height) * 100}%`,
            }}
          >
            <span className="tooltip-period">{points[hoveredPoint].label}</span>
            <span className="tooltip-value">{points[hoveredPoint].value}% Retention</span>
          </div>
        )}
      </div>

      <div className="analytics-summary-bar">
        <div className="summary-stat">
          <span className="stat-label">Observed Velocity</span>
          <span className="stat-value positive">+3.2% / Cycle</span>
        </div>
        <div className="summary-stat">
          <span className="stat-label">Target Stability</span>
          <span className="stat-value">80.0% Index</span>
        </div>
        <div className="summary-stat">
          <span className="stat-label">Active Monitored</span>
          <span className="stat-value">{topicsCount} Topics</span>
        </div>
      </div>
    </div>
  );
}
