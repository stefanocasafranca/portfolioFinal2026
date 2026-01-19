'use client';

import { breakpoints, cols, rowHeights } from '@/utils/consts';
import { useBreakpoint, useMounted } from '@/utils/hooks';
import { cn } from '@/utils/lib';
import { Responsive, ResponsiveProps, WidthProvider } from 'react-grid-layout';
import { useRef, useEffect, useCallback } from 'react';

const ResponsiveGridLayout = WidthProvider(Responsive);

/**
 * Main grid layout component that manages the responsive bento-style layout
 * Handles breakpoint changes, responsive behavior, and grid configuration
 * Provides smooth transitions and proper spacing for all screen sizes
 * 
 * Optimized for mobile: Prevents layout recalculations during scroll to avoid crashes
 */
export default function GridLayout({ layouts, className, children }: Readonly<ResponsiveProps>) {
    const { breakpoint, setBreakpoint } = useBreakpoint();
    const isMounted = useMounted();
    const isScrollingRef = useRef(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const pendingBreakpointRef = useRef<string | null>(null);

    // Use a default breakpoint if not yet calculated (prevents undefined rowHeight)
    const safeBreakpoint = breakpoint || 'xxs';
    const safeRowHeight = rowHeights[safeBreakpoint] || rowHeights.xxs;

    // Track scroll state to prevent layout recalculations during scroll
    useEffect(() => {
        const handleScrollStart = () => {
            isScrollingRef.current = true;
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };

        const handleScrollEnd = () => {
            // Wait after scroll ends before allowing layout updates
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
            scrollTimeoutRef.current = setTimeout(() => {
                isScrollingRef.current = false;
                // Apply any pending breakpoint change after scroll ends
                if (pendingBreakpointRef.current && pendingBreakpointRef.current !== breakpoint) {
                    setBreakpoint(pendingBreakpointRef.current);
                    pendingBreakpointRef.current = null;
                }
            }, 200);
        };

        // Use passive listeners for better scroll performance
        window.addEventListener('scroll', handleScrollStart, { passive: true, capture: true });
        window.addEventListener('scroll', handleScrollEnd, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScrollStart, { capture: true });
            window.removeEventListener('scroll', handleScrollEnd);
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, [breakpoint, setBreakpoint]);

    // Debounced breakpoint change handler that respects scroll state
    const handleBreakpointChange = useCallback((newBreakpoint: string) => {
        if (isScrollingRef.current) {
            // Store pending breakpoint change until scroll ends
            pendingBreakpointRef.current = newBreakpoint;
            return;
        }
        
        // Only update if breakpoint actually changed
        if (newBreakpoint !== breakpoint) {
            setBreakpoint(newBreakpoint);
            pendingBreakpointRef.current = null;
        }
    }, [breakpoint, setBreakpoint]);

    return (
        <section
            className={cn(
                // Line 22: This sets the max container width (1200px)
                'mx-auto max-w-[1200px] max-lg:max-w-[1000px] max-md:max-w-[375px] max-sm:max-w-[320px]',
                isMounted ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0',
                'transition-[opacity,_transform] duration-700',
                className
            )}>
            <ResponsiveGridLayout
                layouts={layouts}
                breakpoints={breakpoints}
                //This passes the column count (4 for large screens) to react-grid-layout
                cols={cols}
                isBounded
                isResizable={false}
                //This passes the row height (280px for large screens) to react-grid-layout  
                rowHeight={safeRowHeight}
                useCSSTransforms={true}
                measureBeforeMount={false}
                draggableCancel='.cancel-drag'
                onBreakpointChange={handleBreakpointChange}
                isDraggable={false}
                compactType={null}
                margin={[16, 16]}>
                {children}
            </ResponsiveGridLayout>
        </section>
    );
}
