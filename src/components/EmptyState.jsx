export default function EmptyState({
  title = "No concepts found",
  message = "No items match your active search and filter parameters.",
  actionLabel,
  onAction,
}) {
  return (
    <div className="editorial-empty-view">
      <div className="empty-symbol-wrap">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <h3 className="empty-title-text">{title}</h3>
      <p className="empty-desc-text">{message}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          className="empty-action-trigger"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
