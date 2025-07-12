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
            <div className="bg-[#f6f2f2] rounded-full px-6 py-2">
                <nav>
                    <div className="inline-flex items-center rounded-full bg-white shadow-sm px-6 py-1 gap-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.label}
                                className={cn(
                                    'font-sf-pro font-semibold text-sm transition-all flex items-center justify-center px-5 py-2 rounded-full',
                                    selectedCategory === tab.value
                                        ? 'bg-white text-black shadow-sm scale-105' // selected: white pill, slightly larger
                                        : 'bg-transparent text-black/90 hover:bg-gray-100', // unselected: no bg, bold, black
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
        </div>
    );
} 