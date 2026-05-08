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
    // Attempt 1: wheretheiss.at (Native HTTPS, fast, but strict rate limits)
    try {
      const response = await axios.get(ISS_POSITION_URL, { timeout: 8000 });
      if (response.data && response.data.latitude) {
        return {
          latitude: parseFloat(response.data.latitude),
          longitude: parseFloat(response.data.longitude),
          timestamp: response.data.timestamp,
          realVelocity: response.data.velocity
        };
      }
    } catch (e) {
      console.warn('Primary ISS API failed or rate-limited, trying fallback...', e.message);
    }

    // Attempt 2: open-notify.org via AllOrigins proxy (More permissive, but slower)
    const fallbackTarget = 'http://api.open-notify.org/iss-now.json';
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(fallbackTarget)}`;
    const response = await axios.get(proxyUrl, { timeout: 10000 });
    
    const data = typeof response.data.contents === 'string' 
      ? JSON.parse(response.data.contents) 
      : response.data.contents;

    if (data && data.iss_position) {
      return {
        latitude: parseFloat(data.iss_position.latitude),
        longitude: parseFloat(data.iss_position.longitude),
        timestamp: data.timestamp
      };
    }
    
    throw new Error('All ISS data sources failed.');
  } catch (error) {
    console.error('Final ISS fetch error:', error);
    throw new Error('Unable to fetch ISS position. The satellite tracking services are currently rate-limited. Please wait 1-2 minutes.');
  }
}

/**
 * Fetch list of people currently in space
 * @returns {Promise<{number: number, people: Array<{name: string, craft: string}>}>}
 */
export async function fetchAstronauts() {
  try {
    // Use allorigins proxy to bypass mixed content and CORS
    const fallbackTarget = 'http://api.open-notify.org/astros.json';
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(fallbackTarget)}`;
    const response = await axios.get(proxyUrl, { timeout: 10000 });
    
    const data = typeof response.data.contents === 'string' 
      ? JSON.parse(response.data.contents) 
      : response.data.contents;
      
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
