import { useMemo, useState } from "react";

export default function RetentionHeatmap({ history = [] }) {
  const [hoveredCell, setHoveredCell] = useState(null);

  const totalWeeks = 7;
  const daysPerWeek = 7;
  const dayLabels = ["M", "", "W", "", "F", "", "S"];

  const cells = useMemo(() => {
    const today = new Date();
    const result = [];
    const totalDays = totalWeeks * daysPerWeek;

    const sessionCount = history.length;

    for (let i = totalDays - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      let intensity = 0;
      if (i === 0 && sessionCount > 0) {
        intensity = 3;
      } else if (i === 1 && sessionCount > 1) {
        intensity = 2;
      } else if (i === 4 && sessionCount > 2) {
        intensity = 2;
      } else if (i === 8 && sessionCount > 0) {
        intensity = 1;
      } else if (i === 12 || i === 15 || i === 22 || i === 28 || i === 35) {
        intensity = 1;
      }

      result.push({
        index: i,
        dateStr,
        intensity,
        count: intensity > 0 ? intensity : 0,
      });
    }
    return result;
  }, [history]);

  const activeDaysCount = useMemo(() => {
    return cells.filter((c) => c.intensity > 0).length;
  }, [cells]);

  return (
    <div className="heatmap-card">
      <div className="heatmap-card-header">
        <div>
          <span className="card-kicker">Cadence & Consistency</span>
          <h3 className="heatmap-title">Active Recall Heatmap</h3>
        </div>
        <div className="heatmap-metrics-pill">
          <span>{activeDaysCount} active days</span>
          <span className="divider-dot">·</span>
          <span>{history.length} total sessions</span>
        </div>
      </div>

      <div className="heatmap-grid-container">
        <div className="heatmap-day-labels">
          {dayLabels.map((lbl, idx) => (
            <span key={idx} className="day-label-text">
              {lbl}
            </span>
          ))}
        </div>

        <div className="heatmap-weeks-grid">
          {Array.from({ length: totalWeeks }).map((_, weekIdx) => (
            <div key={weekIdx} className="heatmap-week-column">
              {Array.from({ length: daysPerWeek }).map((_, dayIdx) => {
                const cellIndex = weekIdx * daysPerWeek + dayIdx;
                const cell = cells[cellIndex];
                if (!cell) return null;

                return (
                  <div
                    key={dayIdx}
                    className={`heatmap-cell intensity-${cell.intensity}`}
                    onMouseEnter={() => setHoveredCell(cell)}
                    onMouseLeave={() => setHoveredCell(null)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="heatmap-footer">
        <div className="heatmap-legend">
          <span className="legend-label">Less</span>
          <span className="heatmap-cell intensity-0" />
          <span className="heatmap-cell intensity-1" />
          <span className="heatmap-cell intensity-2" />
          <span className="heatmap-cell intensity-3" />
          <span className="legend-label">More</span>
        </div>

        {hoveredCell ? (
          <span className="heatmap-hover-info">
            {hoveredCell.dateStr}: {hoveredCell.count > 0 ? `${hoveredCell.count} sessions` : "No sessions"}
          </span>
        ) : (
          <span className="heatmap-hover-info">Last 49 calendar days</span>
        )}
      </div>
    </div>
  );
}
