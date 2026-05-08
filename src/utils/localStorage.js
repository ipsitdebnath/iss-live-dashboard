/**
 * LocalStorage utility functions with expiry support
 */

/**
 * Save data to localStorage with an optional TTL (time-to-live)
 * @param {string} key - Storage key
 * @param {*} value - Data to store
 * @param {number} ttlMinutes - Time-to-live in minutes (0 = no expiry)
 */
export function saveToStorage(key, value, ttlMinutes = 0) {
  try {
    const item = {
      data: value,
      timestamp: Date.now(),
      expiry: ttlMinutes > 0 ? Date.now() + ttlMinutes * 60 * 1000 : null,
    };
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.warn(`Failed to save to localStorage [${key}]:`, error);
  }
}

/**
 * Load data from localStorage, respecting TTL
 * @param {string} key - Storage key
 * @returns {*} Stored data or null if expired/missing
 */
export function loadFromStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const item = JSON.parse(raw);

    // Check if data has expired
    if (item.expiry && Date.now() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return item.data;
  } catch (error) {
    console.warn(`Failed to load from localStorage [${key}]:`, error);
    return null;
  }
}

/**
 * Remove a key from localStorage
 * @param {string} key - Storage key to remove
 */
export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Failed to remove from localStorage [${key}]:`, error);
  }
}
