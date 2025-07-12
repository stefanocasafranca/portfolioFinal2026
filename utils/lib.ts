import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes with proper conflict resolution
 * Uses clsx for conditional classes and twMerge for Tailwind class deduplication
 * @param inputs - Array of class values (strings, objects, arrays, etc.)
 * @returns Merged class string with conflicts resolved
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Converts a string to kebab-case format for URL-friendly slugs
 * Removes special characters and replaces spaces/hyphens with single hyphens
 * @param string - Input string to convert
 * @returns Kebab-case formatted string
 */
export function toKebabCase(string: string): string {
    return string
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-+)|(-+$)/g, '');
}

/**
 * Formats a date string to a human-readable format
 * Uses US locale with full month name, day, and year
 * @param date - Date string to format
 * @returns Formatted date string (e.g., "January 15, 2024")
 */
export function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}
