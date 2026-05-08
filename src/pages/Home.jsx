/**
 * Home Page
 * Layout: ISS section (info cards, map + chart side-by-side), then Breaking News
 * Matches reference design
 */
import ISSMap from '../components/ISSMap';
import ISSInfoCard from '../components/ISSInfoCard';
import SpeedChart from '../components/SpeedChart';
import NewsDashboard from '../components/NewsDashboard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function Home({ issData, newsData }) {
  const {
    currentPosition,
    positions,
    speedHistory,
    astronauts,
    nearestPlace,
    loading: issLoading,
    error: issError,
    autoRefresh,
    refresh: issRefresh,
    toggleAutoRefresh,
  } = issData;

  const {
    filteredArticles,
    sourceDistribution,
    loading: newsLoading,
    error: newsError,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    refreshNews,
  } = newsData;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24">
      {/* ===== ISS TRACKING SECTION ===== */}
      <section id="iss-section" className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden">
        {/* Section header with controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-[var(--border-light)]">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">ISS Live Tracking</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={issRefresh}
              className="px-3 py-1.5 text-sm font-medium rounded-md cursor-pointer
                         border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)]
                         hover:bg-[var(--accent-light)] transition-all duration-200 active:scale-95"
            >
              Refresh Now
            </button>
            <button
              onClick={toggleAutoRefresh}
              className={`px-3 py-1.5 text-sm font-medium rounded-md cursor-pointer
                         border transition-all duration-200 active:scale-95
                         ${autoRefresh
                           ? 'border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-900/20 dark:text-green-400'
                           : 'border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-muted)]'
                         }`}
            >
              Auto-Refresh: {autoRefresh ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* ISS Content */}
        <div className="p-5 space-y-5">
          {issError && !currentPosition ? (
            <ErrorMessage message={issError} onRetry={issRefresh} />
          ) : issLoading && !currentPosition ? (
            <LoadingSpinner message="Connecting to ISS..." />
          ) : (
            <>
              {/* Info Cards */}
              <ISSInfoCard
                currentPosition={currentPosition}
                speedHistory={speedHistory}
                nearestPlace={nearestPlace}
                positionCount={positions.length}
              />

              {/* Map + Speed Chart side by side on desktop */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Map */}
                <div>
                  {currentPosition ? (
                    <ISSMap
                      currentPosition={currentPosition}
                      positions={positions}
                      nearestPlace={nearestPlace}
                    />
                  ) : (
                    <div className="w-full h-[300px] sm:h-[380px] rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)] flex items-center justify-center">
                      <LoadingSpinner message="Loading map..." />
                    </div>
                  )}
                </div>

                {/* Speed Chart */}
                <div>
                  <SpeedChart speedHistory={speedHistory} />
                </div>
              </div>

              {/* Astronaut info */}
              {astronauts && (
                <div className="rounded-lg p-4 border border-[var(--border-color)] bg-[var(--bg-card)]">
                  <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2">
                    👨‍🚀 People in Space: {astronauts.number}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {astronauts.people.map((person, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs
                                   bg-[var(--accent-light)] text-[var(--text-secondary)] border border-[var(--border-light)]"
                      >
                        {person.name}
                        <span className="text-[10px] text-[var(--text-muted)]">({person.craft})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ===== NEWS SECTION ===== */}
      <NewsDashboard
        filteredArticles={filteredArticles}
        sourceDistribution={sourceDistribution}
        loading={newsLoading}
        error={newsError}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        refreshNews={refreshNews}
      />
    </main>
  );
}
