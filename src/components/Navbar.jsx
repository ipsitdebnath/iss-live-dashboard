/**
 * Navbar Component
 * "MISSION CONTROL DASHBOARD" header matching reference design
 */
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[var(--header-bg)] border-b border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Title */}
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--accent)] uppercase">
              Mission Control Dashboard
            </p>
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mt-0.5">
              Real-Time ISS and News Intelligence
            </h1>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
