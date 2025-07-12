/**
 * Responsive breakpoints for the grid layout system
 * Defines the pixel widths at which layout changes occur
 * Used by react-grid-layout for responsive behavior
 */
export const breakpoints: { [key: string]: number } = {
    lg: 1199, // Large screens (1200px and up)
    md: 799,  // Medium screens (800px to 1199px)
    sm: 374,  // Small screens (375px to 799px)
    xs: 319,  // Extra small screens (320px to 374px)
    xxs: 0,   // Mobile screens (below 320px)
};

/**
 * Row heights for different breakpoints
 * Controls the vertical spacing and card heights in the grid
 * Larger values create taller cards, smaller values create more compact layouts
 */
export const rowHeights: { [key: string]: number } = {
    lg: 280, // Large screens: taller cards for better content display
    md: 180, // Medium screens: balanced height for tablets
    sm: 164, // Small screens: compact height for mobile
    xs: 136, // Extra small screens: minimal height for small mobile
    xxs: 132, // Mobile screens: smallest height for very small screens
};

/**
 * Column configuration for different breakpoints
 * Defines how many columns the grid should have at each screen size
 * Affects the horizontal layout and card positioning
 */
export const cols = { 
    lg: 4, // Large screens: 4-column layout for desktop
    md: 4, // Medium screens: 4-column layout for tablets
    sm: 2, // Small screens: 2-column layout for mobile
    xs: 2, // Extra small screens: 2-column layout for small mobile
    xxs: 2 // Mobile screens: 2-column layout for very small mobile
};
