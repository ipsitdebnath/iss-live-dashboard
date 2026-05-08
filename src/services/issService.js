/**
 * ISS Tracking Service
 * Fetches real-time ISS position and astronaut data
 * Uses CORS proxy to access HTTP-only open-notify API from browsers
 */
import axios from 'axios';
import { ISS_POSITION_URL, ISS_ASTROS_URL, REVERSE_GEOCODE_URL } from '../utils/constants';

/**
 * Fetch current ISS position (latitude, longitude, timestamp)
 * @returns {Promise<{latitude: number, longitude: number, timestamp: number}>}
 */
export async function fetchISSPosition() {
  try {
    // Attempt 1: wheretheiss.at (Direct HTTPS)
    try {
      const response = await axios.get(ISS_POSITION_URL, { timeout: 5000 });
      if (response.data && response.data.latitude) {
        return {
          latitude: parseFloat(response.data.latitude),
          longitude: parseFloat(response.data.longitude),
          timestamp: response.data.timestamp,
          realVelocity: response.data.velocity
        };
      }
    } catch (e) {
      console.warn('Primary API failed, trying Fallback A (AllOrigins)...');
    }

    // Attempt 2: open-notify.org via AllOrigins Raw (Bypasses mixed content)
    try {
      const fallbackTarget = 'http://api.open-notify.org/iss-now.json';
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(fallbackTarget)}`;
      const response = await axios.get(proxyUrl, { timeout: 8000 });
      const data = response.data;
      if (data && data.iss_position) {
        return {
          latitude: parseFloat(data.iss_position.latitude),
          longitude: parseFloat(data.iss_position.longitude),
          timestamp: data.timestamp
        };
      }
    } catch (e) {
      console.warn('Fallback A failed, trying Fallback B (CorsProxy)...');
    }

    // Attempt 3: open-notify.org via CorsProxy.io
    const fallbackTargetB = 'http://api.open-notify.org/iss-now.json';
    const proxyUrlB = `https://corsproxy.io/?${encodeURIComponent(fallbackTargetB)}`;
    const responseB = await axios.get(proxyUrlB, { timeout: 8000 });
    const dataB = responseB.data;
    if (dataB && dataB.iss_position) {
      return {
        latitude: parseFloat(dataB.iss_position.latitude),
        longitude: parseFloat(dataB.iss_position.longitude),
        timestamp: dataB.timestamp
      };
    }
    
    throw new Error('All data sources failed.');
  } catch (error) {
    console.error('All ISS tracking sources are currently unavailable:', error.message);
    throw new Error('ISS Tracking is currently rate-limited due to high traffic on this network. Please refresh in a minute.');
  }
}

/**
 * Fetch list of people currently in space
 * @returns {Promise<{number: number, people: Array<{name: string, craft: string}>}>}
 */
export async function fetchAstronauts() {
  try {
    // Use AllOrigins RAW for astronauts as well
    const target = 'http://api.open-notify.org/astros.json';
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`;
    const response = await axios.get(proxyUrl, { timeout: 10000 });
    const data = response.data;
      
    return {
      number: data.number,
      people: data.people,
    };
  } catch (error) {
    console.error('Failed to fetch astronaut data:', error);
    throw new Error('Unable to fetch astronaut data. Please try again.');
  }
}

/**
 * Reverse geocode ISS position to get nearest place name
 * Uses OpenStreetMap Nominatim (free, 1 req/sec limit — fine for 15s intervals)
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<string>} Place name or fallback
 */
export async function fetchNearestPlace(lat, lon) {
  try {
    const response = await axios.get(REVERSE_GEOCODE_URL, {
      params: {
        lat,
        lon,
        format: 'json',
        zoom: 5,
        'accept-language': 'en',
      },
      timeout: 5000,
      headers: {
        'User-Agent': 'ISSTracker/1.0',
      },
    });

    if (response.data?.display_name) {
      // Extract a short place name
      const parts = response.data.display_name.split(',');
      return parts.slice(0, 2).join(',').trim();
    }
    return 'Over ocean / remote area';
  } catch {
    return 'Over ocean / remote area';
  }
}
