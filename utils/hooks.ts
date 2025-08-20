'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
import { breakpoints } from './consts';

/**
 * Custom hook for managing responsive breakpoints
 * Tracks the current screen size and provides breakpoint information
 * Used by the grid layout to determine appropriate column and row configurations
 * @returns Object containing current breakpoint and setter function
 */
function useBreakpoint() {
    const [breakpoint, setBreakpoint] = useState<string>('');

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const newBreakpoint = Object.keys(breakpoints).find((key) => width > breakpoints[key]) ?? 'xxs';
            setBreakpoint(newBreakpoint);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
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
