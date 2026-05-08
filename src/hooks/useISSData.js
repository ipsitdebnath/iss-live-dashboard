/**
 * Custom hook for ISS tracking data
 * Handles auto-refresh, speed calculation, position history, and nearest place
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchISSPosition, fetchAstronauts, fetchNearestPlace } from '../services/issService';
import { haversineDistance, calculateSpeed } from '../utils/haversine';
import { ISS_REFRESH_INTERVAL, ISS_MAX_POSITIONS, ISS_MAX_SPEED_HISTORY } from '../utils/constants';

export function useISSData() {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [positions, setPositions] = useState([]); // Trajectory history
  const [speedHistory, setSpeedHistory] = useState([]); // For speed chart
  const [astronauts, setAstronauts] = useState(null);
  const [nearestPlace, setNearestPlace] = useState('Locating...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Ref to store previous position for speed calculation
  const prevPositionRef = useRef(null);
  const intervalRef = useRef(null);

  /**
   * Fetch ISS position and calculate speed from previous position
   */
  const fetchPosition = useCallback(async () => {
    try {
      const pos = await fetchISSPosition();

      setCurrentPosition(pos);

      // Update trajectory positions (keep last ISS_MAX_POSITIONS)
      setPositions((prev) => {
        const updated = [...prev, [pos.latitude, pos.longitude]];
        return updated.slice(-ISS_MAX_POSITIONS);
      });

      // Calculate speed using Haversine formula or use real-time velocity if available
      let currentSpeed = null;

      if (pos.realVelocity) {
        // Preference 1: Direct speed from satellite (instant)
        currentSpeed = pos.realVelocity;
      } else if (prevPositionRef.current) {
        // Preference 2: Calculated speed from previous positions
        const prev = prevPositionRef.current;
        const dist = haversineDistance(
          prev.latitude, prev.longitude,
          pos.latitude, pos.longitude
        );
        const timeDiff = pos.timestamp - prev.timestamp;
        currentSpeed = calculateSpeed(dist, timeDiff);
      }

      // If we have a speed (either real or calculated), update history
      if (currentSpeed && currentSpeed > 0 && currentSpeed < 50000) {
        setSpeedHistory((prev) => {
          const entry = {
            speed: Math.round(currentSpeed * 100) / 100,
            time: new Date(pos.timestamp * 1000).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }),
            timestamp: pos.timestamp,
          };
          const updated = [...prev, entry];
          return updated.slice(-ISS_MAX_SPEED_HISTORY);
        });
      }

      prevPositionRef.current = pos;
      setError(null);

      // Fetch nearest place (non-blocking)
      fetchNearestPlace(pos.latitude, pos.longitude).then(setNearestPlace);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch astronaut data
   */
  const fetchAstronautData = useCallback(async () => {
    try {
      const data = await fetchAstronauts();
      setAstronauts(data);
    } catch (err) {
      console.error('Failed to fetch astronauts:', err);
    }
  }, []);

  /**
   * Manual refresh handler
   */
  const refresh = useCallback(() => {
    setLoading(true);
    fetchPosition();
    fetchAstronautData();
  }, [fetchPosition, fetchAstronautData]);

  /**
   * Toggle auto-refresh
   */
  const toggleAutoRefresh = useCallback(() => {
    setAutoRefresh((prev) => !prev);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchPosition();
    fetchAstronautData();
  }, [fetchPosition, fetchAstronautData]);

  // Auto-refresh interval management
  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchPosition, ISS_REFRESH_INTERVAL);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefresh, fetchPosition]);

  return {
    currentPosition,
    positions,
    speedHistory,
    astronauts,
    nearestPlace,
    loading,
    error,
    autoRefresh,
    refresh,
    toggleAutoRefresh,
  };
}
