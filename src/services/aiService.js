/**
 * AI Chatbot Service
 * Connects to Hugging Face Inference API using Mistral-7B
 */
import axios from 'axios';
import { AI_API_URL, AI_SYSTEM_PROMPT } from '../utils/constants';

/**
 * Build a context string from current dashboard data
 * to constrain the AI to only dashboard information
 */
function buildDataContext(dashboardData) {
  const { issData, astronauts, news, speedHistory } = dashboardData;

  let context = '';

  if (issData) {
    context += `ISS Current Position: Latitude ${issData.latitude?.toFixed(4)}, Longitude ${issData.longitude?.toFixed(4)}.\n`;
    context += `Last updated: ${new Date(issData.timestamp * 1000).toLocaleString()}.\n`;
  }

  if (speedHistory && speedHistory.length > 0) {
    const latestSpeed = speedHistory[speedHistory.length - 1];
    context += `ISS Current Speed: ${latestSpeed.speed?.toFixed(0)} km/h.\n`;
    context += `Total positions tracked: ${speedHistory.length}.\n`;
  }

  if (astronauts) {
    context += `People in Space: ${astronauts.number}.\n`;
    context += `Astronaut names: ${astronauts.people?.map(p => `${p.name} (${p.craft})`).join(', ')}.\n`;
  }

  if (news && news.length > 0) {
    context += `Latest News Headlines:\n`;
    news.slice(0, 5).forEach((article, i) => {
      context += `${i + 1}. "${article.title}" - ${article.news_site} (${new Date(article.published_at).toLocaleDateString()}): ${article.summary?.slice(0, 100)}...\n`;
    });
  }

  return context;
}

/**
 * Send a message to the AI chatbot with dashboard context
 * @param {string} userMessage - The user's message
 * @param {Object} dashboardData - Current dashboard data for context
 * @returns {Promise<string>} AI response text
 */
export async function sendChatMessage(userMessage, dashboardData) {
  const token = import.meta.env.VITE_AI_TOKEN;

  if (!token || token === 'your_huggingface_token') {
    return "⚠️ AI token not configured. Please add your Hugging Face API token to the .env file as VITE_AI_TOKEN.";
  }

  const dataContext = buildDataContext(dashboardData);
  
  // Standard OpenAI messages format
  const messages = [
    { role: 'system', content: `${AI_SYSTEM_PROMPT}\n\nCurrent Dashboard Data:\n${dataContext}` },
    { role: 'user', content: userMessage }
  ];

  try {
    // Attempt Hugging Face primary API
    const response = await axios.post(
      AI_API_URL,
      {
        model: import.meta.env.VITE_AI_MODEL || 'Qwen/Qwen2.5-72B-Instruct',
        messages: messages,
        max_tokens: 300,
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      }
    );

    if (response.data?.choices?.[0]?.message?.content) {
      return response.data.choices[0].message.content.trim();
    }
    
    throw new Error("Invalid response format from Hugging Face Router API");
  } catch (error) {
    console.error('AI Service Error:', error.message);

    if (error.response?.status === 503) return "🔄 The AI model is loading. Please wait a moment and try again.";
    if (error.response?.status === 401) return "🔑 Invalid API token. Please check your VITE_AI_TOKEN in the .env file.";
    if (error.code === 'ECONNABORTED') return "⏱️ Request timed out. Please try again.";

    return "❌ Failed to get AI response. Please ensure you are connected to the internet.";
  }
}
