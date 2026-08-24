export default function ProgressBar({
  value = 0,
  height = 4,
  color,
}) {
  const clamped = Math.min(Math.max(Math.round(value), 0), 100);

  const getColor = (v) => {
    if (color) return color;
    if (v >= 75) return "#798165";
    if (v >= 60) return "#8C6046";
    return "#96584E";
  };

  return (
    <div className="progress-track" style={{ height: `${height}px` }}>
      <div
        className="progress-fill"
        style={{
          width: `${clamped}%`,
          backgroundColor: getColor(clamped),
        }}
      />
    </div>
  );
}
