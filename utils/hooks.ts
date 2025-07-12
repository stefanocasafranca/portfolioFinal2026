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

export { useBreakpoint, useMounted };
