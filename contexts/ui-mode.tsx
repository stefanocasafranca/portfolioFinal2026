'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UIModeContextType {
  isAiMode: boolean;
  enterAiMode: () => void;
  exitAiMode: () => void;
  isAnimating: boolean;
}

const UIModeContext = createContext<UIModeContextType | undefined>(undefined);

interface UIModeProviderProps {
  children: ReactNode;
}

export function UIModeProvider({ children }: UIModeProviderProps) {
  const [isAiMode, setIsAiMode] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const enterAiMode = () => {
    setIsAnimating(true);
    setIsAiMode(true);
    
    // Clear animation state after transition
    setTimeout(() => setIsAnimating(false), 600);
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
      isAnimating 
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