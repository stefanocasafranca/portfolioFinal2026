import { Description, Location, Project, Resume, Project2, Theme, LinkedIn, DesignProcess, Email, Project3, Project4, Project5 } from '@/components/grid/widgets';
import { Layout } from 'react-grid-layout';

// Define card categories for filtering
export type CardCategory = 'hero' | 'about' | 'projects' | 'contact' | 'theme';

interface GridItem {
    i: string;
    component: React.ComponentType;
    category: CardCategory; // Add category for filtering
    isHero?: boolean; // Hero card is always visible
}

export const gridItems: GridItem[] = [
    { i: 'description', component: Description, category: 'hero', isHero: true }, // Hero card - always visible
    { i: 'location', component: Location, category: 'about' },
    { i: 'project', component: Project, category: 'projects' },
    { i: 'resume', component: Resume, category: 'about' },
    { i: 'project2', component: Project2, category: 'projects' },
    { i: 'theme', component: Theme, category: 'theme' }, // Theme card - no category, never highlighted
    { i: 'linkedin', component: LinkedIn, category: 'contact' },
    { i: 'email', component: Email, category: 'contact' },
    { i: 'project3', component: Project3, category: 'projects' },
    { i: 'project4', component: Project4, category: 'projects' },
    { i: 'project5', component: Project5, category: 'projects' },
    { i: 'design-process', component: DesignProcess, category: 'about' }, // Design process belongs to About
];

type Layouts = 'lg' | 'md' | 'sm';

// Original layouts for reference
const originalLayouts: { [key in Layouts]: Layout[] } = {
    lg: [
        //Row 1
        { i: 'description', x: 0, y: 0, w: 2, h: 1 },
        { i: 'location', x: 2, y: 0, w: 1, h: 1 },
        { i: 'project', x: 3, y: 0, w: 1, h: 2 }, // And Row 2 bc height is 2
        //Row 2
        { i: 'resume', x: 0, y: 1, w: 1, h: 1 },
        { i: 'project2', x: 1, y: 1, w: 2, h: 1 },
        //Row 3                   
        { i: 'theme', x: 0, y: 2, w: 1, h: 1 },
        { i: 'linkedin', x: 1, y: 2, w: 1, h: 1 },
        //Row 4 
        { i: 'design-process', x: 2, y: 2, w: 2, h: 1 },
        { i: 'project3', x: 0, y: 4, w: 1, h: 1 },
        { i: 'project5', x: 1, y: 4, w: 1, h: 1 },
        { i: 'email', x: 2, y: 4, w: 1, h: 1 },
        { i: 'project4', x: 3, y: 4, w: 1, h: 1 },
    ],
    md: [
        //Row 1
        { i: 'description', x: 0, y: 0, w: 2, h: 2 }, // And Row 2 bc height is 2
        { i: 'location', x: 2, y: 0, w: 2, h: 1 },
        //Row 2
        { i: 'linkedin', x: 2, y: 1, w: 1, h: 1 },
        { i: 'project', x: 3, y: 1, w: 1, h: 2 }, // And Row 3 bc height is 2
        //Row 3
        { i: 'resume', x: 0, y: 2, w: 2, h: 1 },
        { i: 'theme', x: 2, y: 2, w: 1, h: 1 },
        //Row 4 and 5
        { i: 'project2', x: 0, y: 3, w: 2, h: 2 },
        { i: 'design-process', x: 2, y: 3, w: 2, h: 2 },
        //Row 6
        { i: 'email', x: 0, y: 5, w: 1, h: 1 },
        { i: 'project3', x: 1, y: 6, w: 1, h: 1 },
        { i: 'project5', x: 2, y: 6, w: 1, h: 1 },
        { i: 'project4', x: 3, y: 6, w: 1, h: 1 },
    ],
    sm: [
        //Row 1 and 2
        { i: 'description', x: 0, y: 0, w: 2, h: 2 },
        //Row 3
        { i: 'location', x: 0, y: 2, w: 2, h: 1 },
        //Row 4
        { i: 'linkedin', x: 0, y: 3, w: 1, h: 1 },
        { i: 'project', x: 1, y: 3, w: 1, h: 2 }, // And Row 5 bc height is 2
        //Row 5
        { i: 'theme', x: 0, y: 4, w: 1, h: 1 },
        //Row 6
        { i: 'project2', x: 0, y: 6, w: 1, h: 2 }, // and Row 7 bc height is 2
        { i: 'resume', x: 1, y: 6, w: 1, h: 1 },
        //Row 7
        { i: 'design-process', x: 1, y: 7, w: 1, h: 1 },
        //Row 8
        { i: 'project3', x: 0, y: 8, w: 1, h: 1 },
        { i: 'project5', x: 1, y: 8, w: 1, h: 1 },
        //Row 9
        { i: 'email', x: 0, y: 9, w: 1, h: 1 },
        { i: 'project4', x: 1, y: 9, w: 1, h: 1 },
    ],
};

// Smart rearrangement within existing grid bounds - prioritizes highlighted cards
function createSmartLayouts(highlightedItems: string[]): { [key in Layouts]: Layout[] } {
    const createArrangement = (breakpoint: Layouts): Layout[] => {
        const allLayouts = [...originalLayouts[breakpoint]];
        const maxCols = breakpoint === 'sm' ? 2 : 4;
        // Calculate max rows based on original layout - mobile needs more rows
        const maxRows = breakpoint === 'sm' 
            ? Math.max(...allLayouts.map(l => l.y + l.h), 11) // Mobile: allow up to row 10+height
            : breakpoint === 'md'
            ? Math.max(...allLayouts.map(l => l.y + l.h), 7) // Tablet: allow up to row 6+height
            : 5; // Desktop: 4-row grid boundary
        
        // Separate highlighted and dimmed items
        const highlighted = allLayouts.filter(layout => highlightedItems.includes(layout.i));
        const dimmed = allLayouts.filter(layout => !highlightedItems.includes(layout.i));
        
        // Sort highlighted items by original position (top-left first)
        highlighted.sort((a, b) => (a.y * maxCols + a.x) - (b.y * maxCols + b.x));
        
        const newLayouts: Layout[] = [];
        const occupiedSpaces = new Set<string>();
        
        // Function to check if a position is available
        const isSpaceAvailable = (x: number, y: number, w: number, h: number): boolean => {
            if (x + w > maxCols || y + h > maxRows) return false;
            for (let cy = y; cy < y + h; cy++) {
                for (let cx = x; cx < x + w; cx++) {
                    if (occupiedSpaces.has(`${cx},${cy}`)) return false;
                }
            }
            return true;
        };
        
        // Function to mark space as occupied
        const markSpaceOccupied = (x: number, y: number, w: number, h: number) => {
            for (let cy = y; cy < y + h; cy++) {
                for (let cx = x; cx < x + w; cx++) {
                    occupiedSpaces.add(`${cx},${cy}`);
                }
            }
        };
        
        // Function to find best position for an item - prioritizes top-left positioning
        const findBestPosition = (w: number, h: number, isHighlighted: boolean = false): {x: number, y: number} | null => {
            // Generate row order dynamically based on maxRows - check all available rows
            const rowOrder = Array.from({ length: maxRows }, (_, i) => i);
            
            for (const y of rowOrder) {
                if (y + h > maxRows) continue;
                for (let x = 0; x <= maxCols - w; x++) {
                    if (isSpaceAvailable(x, y, w, h)) {
                        return { x, y };
                    }
                }
            }
            return null;
        };
        
        // Place highlighted items first in optimal positions (top-left priority)
        highlighted.forEach(layout => {
            let w = layout.w;
            let h = layout.h;
            let position = findBestPosition(w, h, true);
            
            // If original size doesn't fit, try to compress (Plan Z)
            if (!position && w > 1) {
                w = Math.max(1, w - 1);
                position = findBestPosition(w, h, true);
            }
            if (!position && h > 1) {
                h = Math.max(1, h - 1);
                position = findBestPosition(w, h, true);
            }
            if (!position && w > 1 && h > 1) {
                // More aggressive compression if needed
                w = 1;
                h = 1;
                position = findBestPosition(w, h, true);
            }
            
            if (position) {
                newLayouts.push({
                    i: layout.i,
                    x: position.x,
                    y: position.y,
                    w,
                    h
                });
                markSpaceOccupied(position.x, position.y, w, h);
            }
        });
        
        // Place dimmed items in remaining spaces - they get pushed to edges/bottom
        dimmed.forEach(layout => {
            let w = layout.w;
            let h = layout.h;
            let position = findBestPosition(w, h, false);
            
            // Compress if needed (Plan Z)
            if (!position && w > 1) {
                w = Math.max(1, w - 1);
                position = findBestPosition(w, h, false);
            }
            if (!position && h > 1) {
                h = Math.max(1, h - 1);
                position = findBestPosition(w, h, false);
            }
            if (!position && w > 1 && h > 1) {
                // Aggressive compression for dimmed items
                w = 1;
                h = 1;
                position = findBestPosition(w, h, false);
            }
            
            if (position) {
                newLayouts.push({
                    i: layout.i,
                    x: position.x,
                    y: position.y,
                    w,
                    h
                });
                markSpaceOccupied(position.x, position.y, w, h);
            }
        });
        
        return newLayouts;
    };
    
    return {
        lg: createArrangement('lg'),
        md: createArrangement('md'),
        sm: createArrangement('sm')
    };
}

// Create smart layouts for each category
const aboutItems = ['description', 'location', 'resume', 'design-process', 'theme'];
const projectItems = ['project', 'project2', 'project3', 'project4', 'project5', 'theme'];
const contactItems = ['description', 'linkedin', 'email', 'theme'];

export const filteredLayouts = {
    all: originalLayouts,
    about: createSmartLayouts(aboutItems),
    projects: createSmartLayouts(projectItems),
    contact: createSmartLayouts(contactItems)
};


//POP-UPS FOR PROJECTS LAYOUTS -- MAKE THEM PERSONALIZED FOR EACH PROJECT (AFTER PUTTING THE NEW CONTENT)

export const layouts = originalLayouts;

const projectLargeLayout: Layout[] = [
    { i: 'images-1', x: 0, y: 0, w: 2, h: 1 },
    { i: 'images-2', x: 2, y: 0, w: 1, h: 1 },
    { i: 'images-3', x: 3, y: 0, w: 1, h: 2 },
    { i: 'images-4', x: 0, y: 1, w: 1, h: 1 },
    { i: 'images-5', x: 1, y: 1, w: 2, h: 1 },
];

export const projectLayouts: { [key in Layouts]: Layout[] } = {
    lg: projectLargeLayout,
    md: projectLargeLayout,
    sm: [
        { i: 'images-1', x: 0, y: 0, w: 2, h: 1 },
        { i: 'images-2', x: 0, y: 1, w: 1, h: 1 },
        { i: 'images-3', x: 1, y: 1, w: 1, h: 2 },
        { i: 'images-4', x: 0, y: 2, w: 1, h: 1 },
        { i: 'images-5', x: 2, y: 3, w: 2, h: 1 },
    ],
};

// Bento horizontal layout - matches reference image exactly (8 images)
// Row 0: [2x1 horizontal] [1x1 square] [1x2 vertical]
// Row 1: [1x1 square] [2x1 horizontal] [continues 1x2]
// Row 2-3: [2x2 large] [2x1 horizontal] [continues 1x2]
// Row 3: [continues 2x2] [2x1 horizontal]
const bentoHorizontalLayout: { [key in Layouts]: Layout[] } = {
    lg: [
        { i: 'images-1', x: 0, y: 0, w: 2, h: 1 }, // Horizontal (top-left, 2x1)
        { i: 'images-2', x: 2, y: 0, w: 1, h: 1 }, // Square (top-middle, 1x1)
        { i: 'images-3', x: 3, y: 0, w: 1, h: 2 }, // Vertical (top-right, 1x2)
        { i: 'images-4', x: 0, y: 1, w: 1, h: 1 }, // Square (middle-left, 1x1)
        { i: 'images-5', x: 1, y: 1, w: 2, h: 1 }, // Horizontal (middle-center, 2x1)
        { i: 'images-6', x: 0, y: 2, w: 2, h: 2 }, // Large (bottom-left, 2x2)
        { i: 'images-7', x: 2, y: 2, w: 2, h: 1 }, // Horizontal (bottom-middle, 2x1)
        { i: 'images-8', x: 2, y: 3, w: 2, h: 1 }, // Horizontal (bottom-right, 2x1)
    ],
    md: [
        { i: 'images-1', x: 0, y: 0, w: 2, h: 1 }, // Same as lg - scaled proportionally (4 columns)
        { i: 'images-2', x: 2, y: 0, w: 1, h: 1 }, // Same as lg - scaled proportionally
        { i: 'images-3', x: 3, y: 0, w: 1, h: 2 }, // Same as lg - scaled proportionally
        { i: 'images-4', x: 0, y: 1, w: 1, h: 1 }, // Same as lg - scaled proportionally
        { i: 'images-5', x: 1, y: 1, w: 2, h: 1 }, // Same as lg - scaled proportionally
        { i: 'images-6', x: 0, y: 2, w: 2, h: 2 }, // Same as lg - scaled proportionally
        { i: 'images-7', x: 2, y: 2, w: 2, h: 1 }, // Same as lg - scaled proportionally
        { i: 'images-8', x: 2, y: 3, w: 2, h: 1 }, // Same as lg - scaled proportionally
    ],
    sm: [
        { i: 'images-1', x: 0, y: 0, w: 2, h: 1 }, // Top, full width
        { i: 'images-2', x: 0, y: 1, w: 1, h: 1 }, // Below Card 1, left side
        { i: 'images-3', x: 1, y: 1, w: 1, h: 2 }, // Right of Card 2, tall vertical (swapped with images-4)
        { i: 'images-4', x: 0, y: 2, w: 1, h: 1 }, // Below Card 2, same size (swapped with images-3)
        { i: 'images-5', x: 0, y: 3, w: 2, h: 1 }, // Below Card 3 and Card 4, full width
        { i: 'images-7', x: 0, y: 4, w: 2, h: 1 }, // Below Card 5, full width
        { i: 'images-6', x: 0, y: 5, w: 2, h: 2 }, // Below Card 7, large full width
        { i: 'images-8', x: 0, y: 7, w: 2, h: 1 }, // At bottom, full width
    ],
};

// Bento vertical layout - 1x2 vertical cards with 1x1 squares
const bentoVerticalLayout: { [key in Layouts]: Layout[] } = {
    lg: [
        { i: 'images-1', x: 0, y: 0, w: 1, h: 2 }, // Vertical card
        { i: 'images-2', x: 1, y: 0, w: 1, h: 1 }, // Square
        { i: 'images-3', x: 2, y: 0, w: 1, h: 1 }, // Square
        { i: 'images-4', x: 1, y: 1, w: 2, h: 1 }, // Horizontal card
        { i: 'images-5', x: 0, y: 2, w: 3, h: 2 }, // Large card
    ],
    md: [
        { i: 'images-1', x: 0, y: 0, w: 1, h: 2 },
        { i: 'images-2', x: 1, y: 0, w: 1, h: 1 },
        { i: 'images-3', x: 2, y: 0, w: 1, h: 1 },
        { i: 'images-4', x: 1, y: 1, w: 2, h: 1 },
        { i: 'images-5', x: 0, y: 2, w: 3, h: 2 },
    ],
    sm: [
        { i: 'images-1', x: 0, y: 0, w: 1, h: 2 },
        { i: 'images-2', x: 1, y: 0, w: 1, h: 1 },
        { i: 'images-3', x: 0, y: 2, w: 2, h: 1 },
        { i: 'images-4', x: 0, y: 3, w: 1, h: 1 },
        { i: 'images-5', x: 1, y: 3, w: 1, h: 2 },
    ],
};

// Bento redivo layout - similar to bento-horizontal but with images-6 and images-7 as horizontal tiles side by side
const bentoRedivoLayout: { [key in Layouts]: Layout[] } = {
    lg: [
        { i: 'images-1', x: 0, y: 0, w: 2, h: 1 }, // Horizontal (top-left, 2x1)
        { i: 'images-2', x: 2, y: 0, w: 1, h: 1 }, // Square (top-middle, 1x1)
        { i: 'images-3', x: 3, y: 0, w: 1, h: 2 }, // Vertical (top-right, 1x2)
        { i: 'images-4', x: 0, y: 1, w: 1, h: 1 }, // Square (middle-left, 1x1)
        { i: 'images-5', x: 1, y: 1, w: 2, h: 1 }, // Horizontal (middle-center, 2x1)
        { i: 'images-6', x: 0, y: 2, w: 2, h: 1 }, // Horizontal (bottom-left, 2x1) - VIDEO
        { i: 'images-7', x: 2, y: 2, w: 2, h: 1 }, // Horizontal (bottom-right, 2x1) - VIDEO
    ],
    md: [
        { i: 'images-1', x: 0, y: 0, w: 2, h: 1 }, // Same as lg - scaled proportionally (4 columns)
        { i: 'images-2', x: 2, y: 0, w: 1, h: 1 }, // Same as lg - scaled proportionally
        { i: 'images-3', x: 3, y: 0, w: 1, h: 2 }, // Same as lg - scaled proportionally
        { i: 'images-4', x: 0, y: 1, w: 1, h: 1 }, // Same as lg - scaled proportionally
        { i: 'images-5', x: 1, y: 1, w: 2, h: 1 }, // Same as lg - scaled proportionally
        { i: 'images-6', x: 0, y: 2, w: 2, h: 1 }, // Same as lg - scaled proportionally - VIDEO
        { i: 'images-7', x: 2, y: 2, w: 2, h: 1 }, // Same as lg - scaled proportionally - VIDEO
    ],
    sm: [
        { i: 'images-1', x: 0, y: 0, w: 2, h: 1 }, // Top, full width
        { i: 'images-2', x: 0, y: 1, w: 1, h: 1 }, // Below Card 1, left side
        { i: 'images-3', x: 1, y: 1, w: 1, h: 2 }, // Right of Card 2, tall vertical
        { i: 'images-4', x: 0, y: 2, w: 1, h: 1 }, // Below Card 2, same size
        { i: 'images-5', x: 0, y: 3, w: 2, h: 1 }, // Below Card 3 and Card 4, full width
        { i: 'images-6', x: 0, y: 4, w: 2, h: 1 }, // Below Card 5, full width - VIDEO
        { i: 'images-7', x: 0, y: 5, w: 2, h: 1 }, // Below Card 6, full width - VIDEO
    ],
};

// Layout presets registry
export const projectLayoutPresets: Record<string, { [key in Layouts]: Layout[] }> = {
    'default': projectLayouts,
    'bento-horizontal': bentoHorizontalLayout,
    'bento-vertical': bentoVerticalLayout,
    'bento-redivo': bentoRedivoLayout,
};

/**
 * Get project layout based on layout preset name
 * Falls back to 'default' if layout is not specified or invalid
 */
export function getProjectLayout(layoutName?: string): { [key in Layouts]: Layout[] } {
    if (!layoutName || !projectLayoutPresets[layoutName]) {
        return projectLayoutPresets['default'];
    }
    return projectLayoutPresets[layoutName];
}
