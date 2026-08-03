import { useChat } from 'ai/react';
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'stefano-ai-chat-history';
const SESSION_KEY = 'stefano-ai-session-id';

// Generate or retrieve session ID (client-side only)
function getSessionId(): string {
  if (typeof window === 'undefined') {
    return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  try {
    let sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, sessionId);
    }
    return sessionId;
  } catch (err) {
    return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export function useChatbot() {
  const [sessionId] = useState<string>(() => getSessionId());
  
  // Initialize useChat with our API and session metadata
  const { 
    messages, 
    input, 
    handleInputChange, 
    handleSubmit, 
    isLoading, 
    error, 
    setMessages,
    setInput,
    append
  } = useChat({
    api: '/api/chat',
    body: {
      sessionId,
    },
    // Only load initial messages on the client to avoid hydration mismatch
  });

  // Load messages from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setMessages(parsed);
          }
        } catch (e) {
          console.error('Failed to parse saved chat history', e);
        }
      }
    }
  }, [setMessages]);

  // Sync with localStorage when messages change
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const clearMessages = () => {
    setMessages([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return {
    messages,
    isLoading,
    error: error?.message || null,
    input,
    handleInputChange,
    handleSubmit,
    sendMessage: async (m: string) => {
        await append({ role: 'user', content: m });
    },
    clearMessages,
    setInput
  };
}
