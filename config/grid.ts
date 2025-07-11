import { Description, Location, Project, Resume, Project2, Theme, LinkedIn, DesignProcess, Email, Project3, Project4 } from '@/components/grid/widgets';
import { Layout } from 'react-grid-layout';

interface GridItem {
    i: string;
    component: React.ComponentType;
}

export const gridItems: GridItem[] = [
    { i: 'description', component: Description },
    { i: 'location', component: Location },
    { i: 'project', component: Project },
    { i: 'resume', component: Resume },
    { i: 'project2', component: Project2 },
    { i: 'theme', component: Theme },
    { i: 'linkedin', component: LinkedIn },
    { i: 'email', component: Email },
    { i: 'project3', component: Project3 },
    { i: 'project4', component: Project4 },
    { i: 'design-process', component: DesignProcess },
];

type Layouts = 'lg' | 'md' | 'sm';

export const layouts: { [key in Layouts]: Layout[] } = {
    lg: [
        { i: 'description', x: 0, y: 0, w: 2, h: 1 },
        { i: 'location', x: 2, y: 0, w: 1, h: 1 },
        { i: 'project', x: 3, y: 0, w: 1, h: 2 },
        { i: 'resume', x: 0, y: 1, w: 1, h: 1 },
        { i: 'project2', x: 1, y: 1, w: 2, h: 1 },
        { i: 'theme', x: 0, y: 2, w: 1, h: 1 },
        { i: 'linkedin', x: 1, y: 2, w: 1, h: 1 },
        { i: 'design-process', x: 2, y: 2, w: 2, h: 1 },
        { i: 'email', x: 0, y: 3, w: 1, h: 1 },
        // Creating Parks horizontal on 4th row
        { i: 'project3', x: 1, y: 4, w: 2, h: 1 },
        { i: 'project4', x: 3, y: 4, w: 1, h: 1 },
    ],
    md: [
        { i: 'description', x: 0, y: 0, w: 2, h: 2 },
        { i: 'location', x: 2, y: 0, w: 2, h: 1 },
        { i: 'linkedin', x: 2, y: 1, w: 1, h: 1 },
        { i: 'project', x: 3, y: 1, w: 1, h: 2 },
        { i: 'resume', x: 0, y: 2, w: 2, h: 1 },
        { i: 'theme', x: 2, y: 2, w: 1, h: 1 },
        { i: 'project2', x: 0, y: 3, w: 2, h: 2 },
        { i: 'design-process', x: 2, y: 3, w: 2, h: 2 },
        { i: 'email', x: 0, y: 5, w: 1, h: 1 },
        // Creating Parks horizontal on 4th row
        { i: 'project3', x: 1, y: 6, w: 2, h: 1 },
        { i: 'project4', x: 3, y: 6, w: 1, h: 1 },
    ],
    sm: [
        { i: 'description', x: 0, y: 0, w: 2, h: 2 },
        { i: 'location', x: 0, y: 2, w: 2, h: 1 },
        { i: 'linkedin', x: 0, y: 3, w: 1, h: 1 },
        { i: 'project', x: 1, y: 3, w: 1, h: 2 },
        { i: 'theme', x: 0, y: 4, w: 1, h: 1 },
        { i: 'resume', x: 0, y: 5, w: 2, h: 2 },
        { i: 'project2', x: 0, y: 7, w: 2, h: 2 },
        { i: 'design-process', x: 0, y: 9, w: 2, h: 2 },
        // Custom arrangement for email, project4, and project3
        { i: 'email', x: 0, y: 11, w: 1, h: 1 },
        { i: 'project4', x: 1, y: 11, w: 1, h: 1 },
        { i: 'project3', x: 0, y: 12, w: 2, h: 2 },
        // Move any cards that were after project3 down
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
