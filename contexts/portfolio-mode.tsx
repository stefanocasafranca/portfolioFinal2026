'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface PortfolioModeContextType {
  isSubpageMode: boolean;
  isAnimating: boolean;
  setIsSubpageMode: (mode: boolean) => void;
  toggleMode: () => void;
}

const PortfolioModeContext = createContext<PortfolioModeContextType | undefined>(undefined);

interface PortfolioModeProviderProps {
  children: ReactNode;
}

export function PortfolioModeProvider({ children }: PortfolioModeProviderProps) {
  const [isSubpageMode, setIsSubpageMode] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleMode = () => {
    setIsAnimating(true);
    // Small delay to allow animation to start
    setTimeout(() => {
      setIsSubpageMode(prev => !prev);
    }, 50);
    
    // Reset animation state after transition
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  // Handle body scroll lock
  useEffect(() => {
    if (isSubpageMode) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isSubpageMode]);

  return (
    <PortfolioModeContext.Provider value={{ isSubpageMode, isAnimating, setIsSubpageMode, toggleMode }}>
      {children}
    </PortfolioModeContext.Provider>
  );
}

export function usePortfolioMode() {
  const context = useContext(PortfolioModeContext);
  if (context === undefined) {
    throw new Error('usePortfolioMode must be used within a PortfolioModeProvider');
  }
  return context;
}