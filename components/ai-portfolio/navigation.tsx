'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/lib';
import { FaUser, FaBriefcase, FaCode, FaGamepad, FaEnvelope } from 'react-icons/fa6';
import { usePrefersReducedMotion } from '@/utils/hooks';

interface NavigationTab {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    id: string;
    bgColor: string;
    textColor: string;
    hoverBgColor: string;
}

const categoryTabs: NavigationTab[] = [
    { 
        icon: FaUser, 
        label: "Me", 
        id: "me",
        bgColor: "#FFFFFF",
        textColor: "#333333",
        hoverBgColor: "#F0F0F0" // 6% darker
    },
    { 
        icon: FaBriefcase, 
        label: "Projects", 
        id: "projects",
        bgColor: "#E4D9FF", // lavender
        textColor: "#4B2E83",
        hoverBgColor: "#D6C7FF" // 6% darker
    },
    { 
        icon: FaCode, 
        label: "Skills", 
        id: "skills",
        bgColor: "#FFD9E1", // pink
        textColor: "#8B2F45",
        hoverBgColor: "#FFCAD6" // 6% darker
    },
    { 
        icon: FaGamepad, 
        label: "Fun", 
        id: "fun",
        bgColor: "#D9E7FF", // blue
        textColor: "#1E3A8A",
        hoverBgColor: "#CBDBFF" // 6% darker
    },
    { 
        icon: FaEnvelope, 
        label: "Contact", 
        id: "contact",
        bgColor: "#D9FFD9", // green
        textColor: "#166534",
        hoverBgColor: "#CCFFCC" // 6% darker
    }
];

export default function AIPortfolioNavigation() {
    const [activeTab, setActiveTab] = useState<string>('');
    const prefersReducedMotion = usePrefersReducedMotion();

    const handleTabClick = (tabId: string) => {
        if (prefersReducedMotion !== null) { // Only handle clicks after hydration
            setActiveTab(prevTab => prevTab === tabId ? '' : tabId);
            // Future: Expand this to show different content based on tab
        }
    };

    return (
        <motion.div 
            className="w-full flex justify-center"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 50 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? {} : { delay: 1.0, duration: 0.6 }}
        >
            <nav>
                {/* Navigation with card-specific colors and WCAG AA compliance */}
                <div className="inline-flex items-center rounded-full bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-sm px-6 py-2 gap-2">
                    {categoryTabs.map((tab, index) => (
                        <motion.button
                            key={tab.id}
                            onClick={() => handleTabClick(tab.id)}
                            className={cn(
                                'font-sf-pro font-semibold text-sm transition-all flex items-center justify-center gap-1 px-3 py-2 rounded-full',
                                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#111827] focus-visible:outline-offset-2',
                                'active:brightness-[0.97]', // 3% brightness reduction for active state
                                'mx-0.5'
                            )}
                            style={{
                                backgroundColor: activeTab === tab.id ? tab.bgColor : tab.bgColor,
                                color: tab.textColor,
                                '--hover-bg': tab.hoverBgColor,
                            } as React.CSSProperties & { '--hover-bg': string }}
                            onMouseEnter={(e) => {
                                if (!prefersReducedMotion) {
                                    e.currentTarget.style.backgroundColor = tab.hoverBgColor;
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!prefersReducedMotion) {
                                    e.currentTarget.style.backgroundColor = tab.bgColor;
                                }
                            }}
                            type="button"
                            tabIndex={0}
                            aria-pressed={activeTab === tab.id}
                            aria-current={activeTab === tab.id ? 'page' : undefined}
                            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                            transition={prefersReducedMotion ? {} : { delay: 1.1 + index * 0.1, duration: 0.4 }}
                            whileHover={prefersReducedMotion ? {} : { scale: 1.05, y: -2 }}
                            whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                        >
                            <tab.icon 
                                className="text-xs sm:text-sm" 
                                style={{ color: tab.textColor }}
                            />
                            <span 
                                className="whitespace-nowrap text-xs sm:text-sm hidden sm:inline ml-1"
                                style={{ color: tab.textColor }}
                            >
                                {tab.label}
                            </span>
                        </motion.button>
                    ))}
                </div>
            </nav>
        </motion.div>
    );
}