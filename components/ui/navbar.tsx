'use client';

import { cn } from '@/utils/lib';
import { CardCategory } from '@/config/grid';
import { useState } from 'react';

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
    <div className="w-full flex justify-center my-8">
      <nav>
        <div className="inline-flex items-center rounded-full bg-white dark:bg-gray-900 shadow-sm px-6 py-2 gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              className={cn(
                'font-sf-pro font-semibold text-sm transition-all flex items-center justify-center px-5 py-2 rounded-full',
                selectedCategory === tab.value
                  ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm scale-105'
                  : 'bg-transparent text-black/90 dark:text-white/90 hover:bg-gray-100 dark:hover:bg-gray-700',
                'focus:outline-none',
                'mx-1'
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
    </div>
  );
} 