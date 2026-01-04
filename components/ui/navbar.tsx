'use client';

import { cn } from '@/utils/lib';
import { CardCategory } from '@/config/grid';

// Define filter tabs with proper typing
interface FilterTab {
    label: string;
    value: CardCategory | 'all';
}

const tabs: FilterTab[] = [
    { label: 'All', value: 'all' },
    { label: 'About', value: 'about' },
    { label: 'Projects', value: 'projects' },
    { label: 'Contact', value: 'contact' },
];

interface NavbarProps {
    selectedCategory: CardCategory | 'all';
    onCategoryChange: (category: CardCategory | 'all') => void;
}

export default function Navbar({ selectedCategory, onCategoryChange }: NavbarProps) {
  return (
    <nav className="flex justify-center w-full min-w-0">
      <div className='inline-flex items-center rounded-full bg-white dark:bg-gray-900 shadow-sm px-2 py-1 sm:px-3 sm:py-1.5 md:px-6 md:py-2 gap-0.5 sm:gap-1 md:gap-2 flex-shrink-0'>
          {tabs.map((tab) => (
            <button
              key={tab.label}
              className={cn(
                'font-sf-pro font-semibold text-[11px] sm:text-xs md:text-sm transition-all flex items-center justify-center px-1.5 py-1 sm:px-2 sm:py-1.5 md:px-5 md:py-2 rounded-full whitespace-nowrap',
                'min-h-[28px] min-w-[28px] sm:min-h-[32px] md:min-h-[40px]', // Ensure minimum touch target size
                selectedCategory === tab.value
                  ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm scale-105'
                  : 'bg-transparent text-black/90 dark:text-white/90 hover:bg-gray-100 dark:hover:bg-gray-700',
                'focus:outline-none active:scale-95', // Mobile tap feedback
                'mx-0.5 sm:mx-0.5 md:mx-1',
                'cursor-pointer touch-manipulation' // Better mobile interaction
              )}
              type="button"
              tabIndex={0}
              aria-current={selectedCategory === tab.value ? 'page' : undefined}
              onClick={() => onCategoryChange(tab.value)}
            >
              {tab.label}
            </button>
          ))}
      </div>
    </nav>
  );
} 