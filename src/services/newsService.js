/**
 * News Service
 * Fetches spaceflight news articles from the Spaceflight News API
 */
import axios from 'axios';
import { NEWS_API_URL, NEWS_CACHE_KEY, NEWS_CACHE_TTL } from '../utils/constants';
import { saveToStorage, loadFromStorage } from '../utils/localStorage';

/**
 * Fetch latest spaceflight news articles
 * Uses localStorage cache with 15-minute TTL to reduce API calls
 * @param {boolean} forceRefresh - Bypass cache and fetch fresh data
 * @returns {Promise<Array>} Array of news articles
 */
export async function fetchNews(forceRefresh = false) {
  // Check cache first (unless force refresh)
  if (!forceRefresh) {
    const cached = loadFromStorage(NEWS_CACHE_KEY);
    if (cached) return cached;
  }

  try {
    const response = await axios.get(NEWS_API_URL);
    const articles = response.data.results;

    // Cache the results with 15-minute TTL
    saveToStorage(NEWS_CACHE_KEY, articles, NEWS_CACHE_TTL);

    return articles;
  } catch (error) {
    console.error('Failed to fetch news:', error);
    throw new Error('Unable to fetch news articles. Please try again.');
  }
}
