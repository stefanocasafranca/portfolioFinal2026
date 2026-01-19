'use client';

import { breakpoints, cols, rowHeights } from '@/utils/consts';
import { useBreakpoint, useMounted } from '@/utils/hooks';
import { cn } from '@/utils/lib';
import { Responsive, ResponsiveProps, WidthProvider } from 'react-grid-layout';

const ResponsiveGridLayout = WidthProvider(Responsive);

/**
 * Main grid layout component that manages the responsive bento-style layout
 * Handles breakpoint changes, responsive behavior, and grid configuration
 * Provides smooth transitions and proper spacing for all screen sizes
 */
export default function GridLayout({ layouts, className, children }: Readonly<ResponsiveProps>) {
    const { breakpoint, setBreakpoint } = useBreakpoint();
    const isMounted = useMounted();

    // Use a default breakpoint if not yet calculated (prevents undefined rowHeight)
    const safeBreakpoint = breakpoint || 'xxs';
    const safeRowHeight = rowHeights[safeBreakpoint] || rowHeights.xxs;

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
                useCSSTransforms={false}
                measureBeforeMount
                draggableCancel='.cancel-drag'
                onBreakpointChange={setBreakpoint}
                isDraggable={false}
                compactType={null}
                margin={[16, 16]}>
                {children}
            </ResponsiveGridLayout>
        </section>
    );
}
