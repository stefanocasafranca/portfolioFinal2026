import { Description, Location, Project, Resume, Project2, Theme, LinkedIn, DesignProcess, Email, Project3, Project4 } from '@/components/grid/widgets';
import { Layout } from 'react-grid-layout';

// Define card categories for filtering
export type CardCategory = 'hero' | 'about' | 'projects' | 'contact' | 'process';

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
    { i: 'theme', component: Theme, category: 'contact' },
    { i: 'linkedin', component: LinkedIn, category: 'contact' },
    { i: 'email', component: Email, category: 'contact' },
    { i: 'project3', component: Project3, category: 'projects' },
    { i: 'project4', component: Project4, category: 'projects' },
    { i: 'design-process', component: DesignProcess, category: 'process' },
];

type Layouts = 'lg' | 'md' | 'sm';

export const layouts: { [key in Layouts]: Layout[] } = {
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
        { i: 'project3', x: 0, y: 4, w: 2, h: 1 },
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
        { i: 'project3', x: 1, y: 6, w: 2, h: 1 },
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
        //Row 8 and 9
        { i: 'project3', x: 0, y: 8, w: 2, h: 2 },
        //Row 10
        { i: 'email', x: 0, y: 10, w: 1, h: 1 },
        { i: 'project4', x: 1, y: 10, w: 1, h: 1 },
    ],
};

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
