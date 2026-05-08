/**
 * ISSMap Component
 * Interactive Leaflet map with standard OSM tiles, ISS marker, trajectory, popup
 */
import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DEFAULT_MAP_ZOOM, DEFAULT_MAP_CENTER } from '../utils/constants';

// Custom ISS icon
const issIcon = L.divIcon({
  className: 'iss-marker',
  html: `<div style="font-size: 28px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">🛰️</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

/**
 * Smoothly pan map to ISS position
 */
function MapUpdater({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.panTo(position, { animate: true, duration: 1 });
    }
  }, [position, map]);

  return null;
}

export default function ISSMap({ currentPosition, positions, nearestPlace }) {
  const markerPos = useMemo(() => {
    if (!currentPosition) return null;
    return [currentPosition.latitude, currentPosition.longitude];
  }, [currentPosition]);

  return (
    <div className="w-full h-[300px] sm:h-[380px] rounded-lg overflow-hidden border border-[var(--border-color)]">
      <MapContainer
        center={markerPos || DEFAULT_MAP_CENTER}
        zoom={DEFAULT_MAP_ZOOM}
        scrollWheelZoom={true}
        zoomControl={true}
        className="w-full h-full"
      >
        {/* Standard OpenStreetMap tiles (matching reference) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markerPos && <MapUpdater position={markerPos} />}

        {/* ISS Marker */}
        {markerPos && (
          <Marker position={markerPos} icon={issIcon}>
            <Popup>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px' }}>
                <strong>ISS Current Position</strong>
                <br />
                {currentPosition.latitude.toFixed(3)}, {currentPosition.longitude.toFixed(3)}
                <br />
                <span style={{ color: '#6b5344', fontSize: '12px' }}>
                  {nearestPlace || 'Over ocean / remote area'}
                </span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Trajectory polyline */}
        {positions.length > 1 && (
          <Polyline
            positions={positions}
            pathOptions={{
              color: '#c75b12',
              weight: 2,
              opacity: 0.7,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
