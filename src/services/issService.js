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
    // Append a cache-buster parameter directly to the target URL to ensure fresh data
    const targetUrl = `${ISS_POSITION_URL}?_=${Date.now()}`;
    // Wrap with corsproxy.io
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
    
    const response = await axios.get(proxyUrl, { timeout: 10000 });
    const { iss_position, timestamp } = response.data;
    return {
      latitude: parseFloat(iss_position.latitude),
      longitude: parseFloat(iss_position.longitude),
      timestamp,
    };
  } catch (error) {
    console.error('Failed to fetch ISS position:', error);
    throw new Error('Unable to fetch ISS position. Please try again.');
  }
}

/**
 * Fetch list of people currently in space
 * @returns {Promise<{number: number, people: Array<{name: string, craft: string}>}>}
 */
export async function fetchAstronauts() {
  try {
    const targetUrl = `${ISS_ASTROS_URL}?_=${Date.now()}`;
    // Using allorigins for astros to avoid 429 Too Many Requests from corsproxy.io
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
    
    const response = await axios.get(proxyUrl, { timeout: 10000 });
    // allorigins returns the actual JSON string inside the 'contents' property
    const data = typeof response.data.contents === 'string' 
      ? JSON.parse(response.data.contents) 
      : response.data.contents || response.data;
      
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
