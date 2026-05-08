/**
 * NewsCard Component
 * List-style news item with thumbnail, source badge, title, date
 * Expandable to show summary — matching reference design
 */
import { useState } from 'react';

export default function NewsCard({ article }) {
  const [expanded, setExpanded] = useState(false);

  if (!article) return null;

  const publishedDate = new Date(article.published_at).toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const publishedTime = new Date(article.published_at).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return (
    <div
      className="flex items-start gap-3 p-3 border-b border-[var(--border-light)] hover:bg-[var(--bg-card-hover)]
                 transition-colors duration-150 cursor-pointer group"
      onClick={() => setExpanded(!expanded)}
    >
      {/* Thumbnail */}
      {article.image_url ? (
        <img
          src={article.image_url}
          alt=""
          className="w-16 h-16 sm:w-20 sm:h-16 rounded-md object-cover flex-shrink-0"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 64"><rect fill="%23e8d5c4" width="80" height="64" rx="4"/><text x="40" y="36" text-anchor="middle" font-size="24">📰</text></svg>';
          }}
        />
      ) : (
        <div className="w-16 h-16 sm:w-20 sm:h-16 rounded-md bg-[var(--accent-light)] flex items-center justify-center flex-shrink-0 text-xl">
          📰
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {/* Source badge */}
          <span className="text-[11px] font-bold text-[var(--accent)] uppercase tracking-wide">
            {article.news_site}
          </span>
          <span className="text-[11px] text-[var(--text-muted)]">
            {publishedDate}, {publishedTime}
          </span>
        </div>

        {/* Title */}
        <h3 className={`text-sm font-medium text-[var(--text-primary)] leading-snug ${expanded ? '' : 'line-clamp-1'}`}>
          {article.title}
        </h3>

        {/* Expanded summary */}
        {expanded && (
          <div className="mt-2 animate-fade-in">
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-2">
              {article.summary}
            </p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-[var(--accent)] hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Read More →
            </a>
          </div>
        )}
      </div>

      {/* Bookmark icon */}
      <button
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                   text-[var(--accent)] hover:bg-[var(--accent-light)] transition-colors cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          // Bookmark functionality placeholder
        }}
        title="Bookmark"
      >
        🔖
      </button>
    </div>
  );
}
