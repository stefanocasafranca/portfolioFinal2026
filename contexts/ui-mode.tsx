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

interface UIModeProviderProps {
  children: ReactNode;
}

export function UIModeProvider({ children }: UIModeProviderProps) {
  const [isAiMode, setIsAiMode] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  const enterAiMode = () => {
    // First show the purple "activating" state
    setIsActivating(true);
    
    // After a delay, start the actual transition
    setTimeout(() => {
      setIsActivating(false);
      setIsAnimating(true);
      setIsAiMode(true);
      
      // Clear animation state after transition
      setTimeout(() => setIsAnimating(false), 600);
    }, 800); // 800ms delay to see the purple activation
  };

  const exitAiMode = () => {
    setIsAnimating(true);
    setIsAiMode(false);
    
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