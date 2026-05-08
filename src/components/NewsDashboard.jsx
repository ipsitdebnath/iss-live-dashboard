/**
 * NewsDashboard Component
 * "Breaking News" section with search, sort, list layout — matching reference
 */
import { useState } from 'react';
import NewsCard from './NewsCard';
import NewsChart from './NewsChart';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

export default function NewsDashboard({
  filteredArticles,
  sourceDistribution,
  loading,
  error,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  refreshNews,
}) {
  const [sourceFilter, setSourceFilter] = useState(null);

  const handleSourceClick = (sourceName) => {
    setSourceFilter((prev) => (prev === sourceName ? null : sourceName));
  };

  const displayedArticles = sourceFilter
    ? filteredArticles.filter((a) => a.news_site === sourceFilter)
    : filteredArticles;

  return (
    <section id="news-section">
      {/* "Breaking News" header with Refresh button */}
      <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-light)]">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Breaking News</h2>
          <button
            onClick={refreshNews}
            disabled={loading}
            className="px-4 py-1.5 text-sm font-medium rounded-md cursor-pointer
                       border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)]
                       hover:bg-[var(--accent-light)] transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            Refresh
          </button>
        </div>

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-3 px-5 py-3 border-b border-[var(--border-light)]">
          <input
            type="text"
            placeholder="Search title, source, author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 rounded-md text-sm bg-[var(--input-bg)] border border-[var(--border-color)]
                       text-[var(--text-primary)] placeholder-[var(--text-muted)]
                       focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]
                       transition-all duration-200"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-md text-sm bg-[var(--input-bg)] border border-[var(--border-color)]
                       text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30
                       cursor-pointer"
          >
            <option value="date">Sort by Date</option>
            <option value="source">Sort by Source</option>
          </select>
        </div>

        {/* Source filter indicator */}
        {sourceFilter && (
          <div className="px-5 py-2 bg-[var(--accent-light)] border-b border-[var(--border-light)] flex items-center gap-2">
            <span className="text-xs text-[var(--accent)]">
              Filtering: <strong>{sourceFilter}</strong>
            </span>
            <button
              onClick={() => setSourceFilter(null)}
              className="text-xs text-[var(--accent)] hover:underline cursor-pointer"
            >
              ✕ Clear
            </button>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <LoadingSpinner message="Fetching news..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={refreshNews} />
        ) : displayedArticles.length > 0 ? (
          <div>
            {displayedArticles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12 text-sm text-[var(--text-muted)]">
            No articles found.
          </div>
        )}
      </div>

      {/* News Source Chart (below news list) */}
      {sourceDistribution.length > 0 && (
        <div className="mt-6">
          <NewsChart
            sourceDistribution={sourceDistribution}
            onSourceClick={handleSourceClick}
          />
        </div>
      )}
    </section>
  );
}
