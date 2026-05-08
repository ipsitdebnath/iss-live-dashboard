/**
 * LoadingSpinner Component
 * Clean loading indicator
 */
export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className="w-10 h-10 border-3 border-[var(--border-color)] border-t-[var(--accent)] rounded-full animate-spin" />
      <p className="text-sm text-[var(--text-muted)]">{message}</p>
    </div>
  );
}
