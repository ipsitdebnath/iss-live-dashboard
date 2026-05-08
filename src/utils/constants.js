/**
 * Application constants
 */

// ISS Tracking
// ISS Tracking
// We will wrap this in a CORS proxy in issService.js to bypass caching properly
export const ISS_POSITION_URL = 'http://api.open-notify.org/iss-now.json';
export const ISS_ASTROS_URL = 'http://api.open-notify.org/astros.json';
export const ISS_REFRESH_INTERVAL = 15000; // 15 seconds
export const ISS_MAX_POSITIONS = 50; // Max positions stored for trajectory
export const ISS_MAX_SPEED_HISTORY = 30; // Max speed data points for chart

// Reverse geocoding for nearest place
export const REVERSE_GEOCODE_URL = 'https://nominatim.openstreetmap.org/reverse';

// News
export const NEWS_API_URL = 'https://api.spaceflightnewsapi.net/v4/articles/?limit=12';
export const NEWS_CACHE_KEY = 'iss_dashboard_news';
export const NEWS_CACHE_TTL = 15; // 15 minutes

// Chatbot
export const CHAT_STORAGE_KEY = 'iss_dashboard_chat';
export const CHAT_MAX_MESSAGES = 30;
export const AI_MODEL = 'Qwen/Qwen2.5-72B-Instruct';
export const AI_API_URL = 'https://router.huggingface.co/v1/chat/completions';
export const FALLBACK_AI_URL = 'https://text.pollinations.ai/openai';

// Theme
export const THEME_STORAGE_KEY = 'iss_dashboard_theme';

// AI System Prompt
export const AI_SYSTEM_PROMPT = `You are a helpful assistant for the ISS Live Tracker & News Dashboard. Answer ONLY using provided dashboard data including ISS location, ISS speed, astronaut count, astronaut names, news articles, and news summaries. If the answer is unavailable in the provided data, respond: "I only know dashboard data." Do NOT use general internet knowledge, do NOT guess, and do NOT hallucinate.`;

// Map defaults
export const DEFAULT_MAP_ZOOM = 3;
export const DEFAULT_MAP_CENTER = [0, 0];
