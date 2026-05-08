/**
 * App Component
 * Root component — wires Navbar, Home, and Chatbot with centralized data
 */
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Chatbot from './components/Chatbot';
import { useISSData } from './hooks/useISSData';
import { useNewsData } from './hooks/useNewsData';

export default function App() {
  // Centralized data fetching — shared between Home and Chatbot
  const issData = useISSData();
  const newsData = useNewsData();

  // Dashboard data context for AI chatbot
  const dashboardData = {
    issData: issData.currentPosition,
    astronauts: issData.astronauts,
    speedHistory: issData.speedHistory,
    news: newsData.filteredArticles,
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'toast-custom',
          duration: 3000,
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
          },
        }}
      />

      <Navbar />
      <Home issData={issData} newsData={newsData} />
      <Chatbot dashboardData={dashboardData} />
    </div>
  );
}
