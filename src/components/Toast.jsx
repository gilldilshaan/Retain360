export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="editorial-toast-notification" role="status">
      <span className="toast-dot-indicator" />
      <span className="toast-content-text">{message}</span>
    </div>
  );
}
