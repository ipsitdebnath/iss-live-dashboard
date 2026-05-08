/**
 * ISSInfoCard Component
 * Shows Lat/Lng, Speed, Nearest Place, Tracked Positions — matching reference layout
 */
export default function ISSInfoCard({ currentPosition, speedHistory, nearestPlace, positionCount }) {
  const latestSpeed = speedHistory.length > 0 ? speedHistory[speedHistory.length - 1].speed : null;

  const cards = [
    {
      label: 'Latitude / Longitude',
      value: currentPosition
        ? `${currentPosition.latitude.toFixed(3)}, ${currentPosition.longitude.toFixed(3)}`
        : '—',
    },
    {
      label: 'Speed',
      value: latestSpeed != null ? `${latestSpeed.toFixed(2)} km/h` : '—',
    },
    {
      label: 'Nearest Place',
      value: nearestPlace || 'Over ocean / remote area',
    },
    {
      label: 'Tracked Positions',
      value: positionCount.toString(),
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card, i) => (
        <div
          key={i}
          className="rounded-lg p-4 border border-[var(--border-color)] bg-[var(--bg-card)]"
        >
          <p className="text-xs text-[var(--text-muted)] mb-1">{card.label}</p>
          <p className="text-sm sm:text-base font-bold text-[var(--text-primary)] break-words">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
