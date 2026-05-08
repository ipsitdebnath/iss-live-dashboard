/**
 * Chatbot Component
 * Clean floating AI chatbot — "AI Assistant" style matching reference
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { sendChatMessage } from '../services/aiService';
import { saveToStorage, loadFromStorage, removeFromStorage } from '../utils/localStorage';
import { CHAT_STORAGE_KEY, CHAT_MAX_MESSAGES } from '../utils/constants';

export default function Chatbot({ dashboardData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const saved = loadFromStorage(CHAT_STORAGE_KEY);
    if (saved) setMessages(saved);
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      saveToStorage(CHAT_STORAGE_KEY, messages.slice(-CHAT_MAX_MESSAGES));
    }
  }, [messages]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  /**
   * Send a message to the AI
   */
  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const userMsg = { role: 'user', content: trimmed, time: new Date().toLocaleTimeString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await sendChatMessage(trimmed, dashboardData);
      const aiMsg = { role: 'assistant', content: response, time: new Date().toLocaleTimeString() };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errorMsg = { role: 'assistant', content: 'Failed to get response. Please try again.', time: new Date().toLocaleTimeString() };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, dashboardData]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
    removeFromStorage(CHAT_STORAGE_KEY);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center
                   text-xl text-white shadow-lg cursor-pointer transition-all duration-300
                   hover:scale-110 active:scale-95"
        style={{
          background: isOpen ? '#dc2626' : 'var(--accent)',
        }}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-sm rounded-xl overflow-hidden
                     border border-[var(--border-color)] shadow-xl animate-fade-in-up
                     flex flex-col bg-[var(--bg-secondary)]"
          style={{ height: 'min(480px, 70vh)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)] bg-[var(--bg-card)]">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">AI Assistant</h3>
            <button
              onClick={clearChat}
              className="text-xs px-2.5 py-1 rounded-md cursor-pointer
                         text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)]
                         transition-all duration-200"
              title="Clear chat history"
            >
              Clear
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-8 text-[var(--text-muted)] text-sm">
                <p>Hello. How can I help you with the ISS or News data?</p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed
                    ${msg.role === 'user'
                      ? 'bg-[var(--chat-user-bg)] text-white rounded-br-sm'
                      : 'bg-[var(--chat-ai-bg)] text-[var(--text-primary)] rounded-bl-sm'
                    }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[var(--chat-ai-bg)] rounded-xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-[var(--border-color)] p-3 bg-[var(--bg-card)]">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask from dashboard data only"
                disabled={isTyping}
                className="flex-1 px-3 py-2.5 rounded-lg text-sm bg-[var(--input-bg)] border border-[var(--border-color)]
                           text-[var(--text-primary)] placeholder-[var(--text-muted)]
                           focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30
                           disabled:opacity-50 transition-all duration-200"
              />
              <button
                onClick={handleSend}
                disabled={isTyping || !input.trim()}
                className="px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer
                           bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]
                           transition-all duration-200
                           disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
