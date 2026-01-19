import { useState, useCallback, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface UseChatbotReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
}

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
    // Fallback if localStorage is unavailable
    return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export function useChatbot(): UseChatbotReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState<string>(() => getSessionId());

  // Load messages from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setMessages(parsed);
        }
      }
    } catch (err) {
      // Silently handle errors - don't log to console in production
      if (process.env.NODE_ENV === 'development') {
      console.error('Failed to load chat history from localStorage:', err);
      }
      // Clear corrupted data
      try {
      localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore removal errors
      }
    }
  }, []);

  // Save messages to localStorage whenever they change (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      if (messages.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (err) {
      // Silently handle errors - don't log to console in production
      if (process.env.NODE_ENV === 'development') {
      console.error('Failed to save chat history to localStorage:', err);
      }
      // Handle quota exceeded or other storage errors silently
    }
  }, [messages]);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    setIsLoading(true);
    setError(null);

    // Add user message immediately and capture conversation history
    const userMessage: Message = { role: 'user', content: message };
    let assistantMessageIndex = 0;
    let conversationHistory: Message[] = [];

    setMessages((prev) => {
      conversationHistory = [...prev, userMessage];
      const newMessages = [...conversationHistory];
      assistantMessageIndex = newMessages.length;
    // Add empty assistant message that will be populated with streaming content
      newMessages.push({ role: 'assistant', content: '' });
      return newMessages;
    });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationHistory,
          sessionId, // Include session ID for analytics
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      let streamedContent = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        // Decode the chunk
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);

            if (data === '[DONE]') {
              setIsLoading(false);
              break;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                streamedContent += parsed.content;

                // Update the assistant message with accumulated content
                setMessages((prev) => {
                  const newMessages = [...prev];
                  newMessages[assistantMessageIndex] = {
                    role: 'assistant',
                    content: streamedContent
                  };
                  return newMessages;
                });
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send message. Please try again.';
      setError(errorMessage);

      // Remove the user message and empty assistant message if there was an error
      setMessages((prev) => prev.slice(0, -2));
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
        // Silently handle errors - don't log to console in production
        if (process.env.NODE_ENV === 'development') {
      console.error('Failed to clear chat history from localStorage:', err);
        }
      }
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}
