export default function MetricStrip({ summaryCounts }) {
  const pad = (n) => String(n || 0).padStart(2, "0");

  const metrics = [
    {
      value: pad(summaryCounts.total || 8),
      label: "Topics tracked",
      colorClass: "metric-neutral",
    },
    {
      value: pad(summaryCounts.fading || 3),
      label: "Need attention",
      colorClass: "metric-decay",
    },
    {
      value: pad(summaryCounts.strong || 3),
      label: "Strong topics",
      colorClass: "metric-strong",
    },
    {
      value: pad(summaryCounts.recent || 2),
      label: "Recently reviewed",
      colorClass: "metric-active",
    },
  ];

  return (
    <div className="editorial-metric-strip">
      {metrics.map((m, idx) => (
        <div key={m.label} className="metric-strip-item">
          <div className="metric-strip-content">
            <span className={`metric-numeral-editorial ${m.colorClass}`}>
              {m.value}
            </span>
            <span className="metric-descriptor-text">{m.label}</span>
          </div>
          {idx < metrics.length - 1 && (
            <div className="metric-strip-divider" aria-hidden="true" />
          )}
        </div>
      ))}
    </div>
  );
}
