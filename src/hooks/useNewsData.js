/**
 * Custom hook for news data
 * Handles fetching, caching, searching, and sorting
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchNews } from '../services/newsService';

export function useNewsData() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date' or 'source'

  /**
   * Load news articles
   */
  const loadNews = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNews(forceRefresh);
      setArticles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh news (bypass cache)
   */
  const refreshNews = useCallback(() => {
    loadNews(true);
  }, [loadNews]);

  // Initial load
  useEffect(() => {
    loadNews();
  }, [loadNews]);

  /**
   * Filtered and sorted articles
   */
  const filteredArticles = useMemo(() => {
    let result = [...articles];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (article) =>
          article.title?.toLowerCase().includes(query) ||
          article.summary?.toLowerCase().includes(query) ||
          article.news_site?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    if (sortBy === 'date') {
      result.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
    } else if (sortBy === 'source') {
      result.sort((a, b) => (a.news_site || '').localeCompare(b.news_site || ''));
    }

    return result;
  }, [articles, searchQuery, sortBy]);

  /**
   * Source distribution for chart
   */
  const sourceDistribution = useMemo(() => {
    const counts = {};
    articles.forEach((article) => {
      const source = article.news_site || 'Unknown';
      counts[source] = (counts[source] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [articles]);

  return {
    articles,
    filteredArticles,
    sourceDistribution,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    refreshNews,
  };
}
