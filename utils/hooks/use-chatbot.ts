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
  // useChat's `error` only clears itself on a subsequent successful request,
  // so clearing the conversation would otherwise leave a stale error banner
  // on screen with no way to dismiss it. This tracks an explicit dismissal
  // that gets released again the moment a new error comes in.
  const [errorDismissed, setErrorDismissed] = useState(false);

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

  useEffect(() => {
    if (error) setErrorDismissed(false);
  }, [error]);

  // Load messages from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setMessages(parsed);
        }
      } catch (e) {
        console.error('Failed to parse saved chat history', e);
        // The stored value is corrupted JSON — drop it rather than leaving
        // it behind to fail the same parse again on every future load.
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (removeErr) {
          console.error('Failed to remove corrupted chat history', removeErr);
        }
      }
    } catch (err) {
      // localStorage can throw on read too (e.g. some privacy modes).
      console.error('Failed to read saved chat history', err);
    }
  }, [setMessages]);

  // Sync with localStorage when messages change
  useEffect(() => {
    if (typeof window === 'undefined' || messages.length === 0) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (err) {
      // Safari private mode reports a quota of 0, so setItem always throws.
      // Losing persistence there is acceptable; letting it throw inside this
      // effect is not — it would surface as an uncaught React error and take
      // the whole chat down.
      console.error('Failed to persist chat history', err);
    }
  }, [messages]);

  const clearMessages = () => {
    setMessages([]);
    setErrorDismissed(true);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (err) {
        console.error('Failed to clear saved chat history', err);
      }
    }
  };

  return {
    messages,
    isLoading,
    error: errorDismissed ? null : error?.message || null,
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
