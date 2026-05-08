/**
 * ErrorMessage Component
 * Clean error state with retry
 */
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-3 animate-fade-in">
      <p className="text-[var(--text-secondary)] text-sm text-center max-w-md">
        ⚠️ {message || 'Something went wrong. Please try again.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer
                     bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]
                     transition-all duration-200 active:scale-95"
        >
          Retry
        </button>
      )}
    </div>
  );
}
