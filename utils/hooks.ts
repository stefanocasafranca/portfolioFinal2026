'use client';

import { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { breakpoints } from './consts';

/**
 * Custom hook for managing responsive breakpoints
 * Tracks the current screen size and provides breakpoint information
 * Used by the grid layout to determine appropriate column and row configurations
 * @returns Object containing current breakpoint and setter function
 */
function useBreakpoint() {
    // Initialize with 'xxs' as default for mobile-first approach
    const [breakpoint, setBreakpoint] = useState<string>('xxs');
    const isScrollingRef = useRef(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        let lastWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
        
        // Track scroll state to prevent breakpoint changes during scroll
        const handleScrollStart = () => {
            isScrollingRef.current = true;
            // Clear any existing timeout
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };

        const handleScrollEnd = () => {
            // Wait a bit after scroll ends before allowing breakpoint changes
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
            scrollTimeoutRef.current = setTimeout(() => {
                isScrollingRef.current = false;
            }, 300);
        };
        
        const handleResize = () => {
            // Don't update breakpoint if user is actively scrolling
            if (isScrollingRef.current) {
                return;
            }

            // Throttle resize events to prevent excessive updates on mobile
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                // Double-check we're not scrolling
                if (isScrollingRef.current) {
                    return;
                }

                const width = window.innerWidth;
                
                // Only update if width actually changed significantly (not just address bar hide/show)
                // Mobile address bar can cause 50-100px changes that shouldn't trigger breakpoint changes
                const widthDiff = Math.abs(width - lastWidth);
                if (widthDiff < 50) {
                    // Likely just address bar, ignore
                    return;
                }
                
                lastWidth = width;
                
                const newBreakpoint = Object.keys(breakpoints).find((key) => width > breakpoints[key]) ?? 'xxs';
                setBreakpoint((prev) => {
                    // Only update if breakpoint actually changed
                    return prev !== newBreakpoint ? newBreakpoint : prev;
                });
            }, 300); // Increased throttle to 300ms for better scroll stability
        };

        // Calculate initial breakpoint immediately
        if (typeof window !== 'undefined') {
            lastWidth = window.innerWidth;
            handleResize();
            
            // Listen for scroll events to prevent breakpoint changes during scroll
            window.addEventListener('scroll', handleScrollStart, { passive: true, capture: true });
            window.addEventListener('scroll', handleScrollEnd, { passive: true });
            window.addEventListener('resize', handleResize, { passive: true });
            
            return () => {
                window.removeEventListener('scroll', handleScrollStart, { capture: true });
                window.removeEventListener('scroll', handleScrollEnd);
                window.removeEventListener('resize', handleResize);
                clearTimeout(timeoutId);
                if (scrollTimeoutRef.current) {
                    clearTimeout(scrollTimeoutRef.current);
                }
            };
        }
    }, []);

    return { breakpoint, setBreakpoint };
}

/**
 * Custom hook for handling hydration mismatch issues
 * Ensures components only render on the client side to prevent SSR/CSR mismatches
 * Useful for components that depend on browser APIs or theme detection
 * @returns Boolean indicating if the component has mounted on the client
 */
function useMounted() {
    const [mounted, setMounted] = useState(false);

    useLayoutEffect(() => {
        setMounted(true);
    }, []);

    return mounted;
}

/**
 * Custom hook for detecting user's reduced motion preference
 * Respects accessibility settings for animations
 * @returns Boolean indicating if user prefers reduced motion
 */
function usePrefersReducedMotion() {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (event: MediaQueryListEvent) => {
            setPrefersReducedMotion(event.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return prefersReducedMotion;
}

export { useBreakpoint, useMounted, usePrefersReducedMotion };
