'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UIModeContextType {
  isAiMode: boolean;
  enterAiMode: () => void;
  exitAiMode: () => void;
  isAnimating: boolean;
  isActivating: boolean;
}

const UIModeContext = createContext<UIModeContextType | undefined>(undefined);

const AI_MODE_KEY = 'portfolio-ai-mode';

function persistAiMode(active: boolean) {
  if (typeof window === 'undefined') return;
  try {
    if (active) sessionStorage.setItem(AI_MODE_KEY, 'true');
    else sessionStorage.removeItem(AI_MODE_KEY);
  } catch {
    // sessionStorage can throw in private mode; mode just won't survive navigation.
  }
}

interface UIModeProviderProps {
  children: ReactNode;
}

export function UIModeProvider({ children }: UIModeProviderProps) {
  const [isAiMode, setIsAiMode] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  // Opening a project is a real navigation, which tears down this state. Restore
  // AI mode on return so closing a project lands back in the chat, not the grid.
  // Read after mount rather than in useState to avoid a hydration mismatch.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (sessionStorage.getItem(AI_MODE_KEY) === 'true') setIsAiMode(true);
    } catch {
      // ignore
    }
  }, []);

  const enterAiMode = () => {
    // First show the purple "activating" state
    setIsActivating(true);

    // After a delay, start the actual transition
    setTimeout(() => {
      setIsActivating(false);
      setIsAnimating(true);
      setIsAiMode(true);
      persistAiMode(true);

      // Clear animation state after transition
      setTimeout(() => setIsAnimating(false), 600);
    }, 800); // 800ms delay to see the purple activation
  };

  const exitAiMode = () => {
    setIsAnimating(true);
    setIsAiMode(false);
    persistAiMode(false);

    // Clear animation state after transition
    setTimeout(() => setIsAnimating(false), 600);
  };

  // No cleanup needed since we're not modifying body scroll

  return (
    <UIModeContext.Provider value={{ 
      isAiMode, 
      enterAiMode, 
      exitAiMode, 
      isAnimating,
      isActivating
    }}>
      {children}
    </UIModeContext.Provider>
  );
}

export function useUIMode() {
  const context = useContext(UIModeContext);
  if (context === undefined) {
    throw new Error('useUIMode must be used within a UIModeProvider');
  }
  return context;
}