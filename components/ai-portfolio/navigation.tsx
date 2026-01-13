'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/lib';
import { FaUser, FaBriefcase, FaCode, FaGamepad, FaEnvelope } from 'react-icons/fa6';
import { usePrefersReducedMotion } from '@/utils/hooks';

interface NavigationTab {
    icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
    label: string;
    id: string;
    bgColor: string;
    textColor: string;
    hoverBgColor: string;
    suggestedQuestions: string[];
    description: string;
}

const categoryTabs: NavigationTab[] = [
    { 
        icon: FaUser, 
        label: "Me", 
        id: "me",
        bgColor: "#FFFFFF",
        textColor: "#333333",
        hoverBgColor: "#F0F0F0",
        description: "Learn about my background, experience, and journey",
        suggestedQuestions: [
            "What's your background?",
            "Tell me about yourself",
            "Where are you from?",
            "What do you do?",
            "What's your story?"
        ]
    },
    { 
        icon: FaBriefcase, 
        label: "Projects", 
        id: "projects",
        bgColor: "#E4D9FF",
        textColor: "#4B2E83",
        hoverBgColor: "#D6C7FF",
        description: "Explore my work, projects, and case studies",
        suggestedQuestions: [
            "Tell me about your projects",
            "What's your favorite project?",
            "Show me your portfolio",
            "What projects are you working on?",
            "Tell me about CLE"
        ]
    },
    { 
        icon: FaCode, 
        label: "Skills", 
        id: "skills",
        bgColor: "#FFD9E1",
        textColor: "#8B2F45",
        hoverBgColor: "#FFCAD6",
        description: "Discover my technical and design skills",
        suggestedQuestions: [
            "What technologies do you know?",
            "What are your skills?",
            "What programming languages do you use?",
            "What design tools do you use?",
            "What's your tech stack?"
        ]
    },
    { 
        icon: FaGamepad, 
        label: "Fun", 
        id: "fun",
        bgColor: "#D9E7FF",
        textColor: "#1E3A8A",
        hoverBgColor: "#CBDBFF",
        description: "Get to know my interests and hobbies",
        suggestedQuestions: [
            "What are your hobbies?",
            "What do you do for fun?",
            "Tell me something interesting about you",
            "What are your interests?",
            "What's your favorite thing to do?"
        ]
    },
    { 
        icon: FaEnvelope, 
        label: "Contact", 
        id: "contact",
        bgColor: "#D9FFD9",
        textColor: "#166534",
        hoverBgColor: "#CCFFCC",
        description: "Get in touch and learn about opportunities",
        suggestedQuestions: [
            "Are you looking for work?",
            "How can I contact you?",
            "Are you available for projects?",
            "What's your email?",
            "Can we collaborate?"
        ]
    }
];

interface AIPortfolioNavigationProps {
    onQuestionSelect?: (question: string) => void;
}

export default function AIPortfolioNavigation({ onQuestionSelect }: AIPortfolioNavigationProps) {
    const [activeTab, setActiveTab] = useState<string>('');
    const prefersReducedMotion = usePrefersReducedMotion();

    const handleTabClick = (tabId: string) => {
        if (prefersReducedMotion !== null) {
            setActiveTab(prevTab => prevTab === tabId ? '' : tabId);
        }
    };

    const handleQuestionClick = (question: string) => {
        if (onQuestionSelect) {
            onQuestionSelect(question);
            setActiveTab(''); // Close the suggestions panel after selection
        }
    };

    const activeTabData = categoryTabs.find(tab => tab.id === activeTab);

    return (
        <div className="w-full flex flex-col items-center gap-4">
            <motion.div 
                className="w-full flex justify-center"
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 50 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                transition={prefersReducedMotion ? {} : { delay: 1.0, duration: 0.6 }}
            >
                <nav>
                    {/* Navigation with card-specific colors and WCAG AA compliance */}
                    <div className="inline-flex items-center rounded-full bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-sm px-2 sm:px-4 md:px-6 py-1.5 sm:py-2 gap-1 sm:gap-2 overflow-x-auto scrollbar-hide">
                        {categoryTabs.map((tab, index) => (
                            <motion.button
                                key={tab.id}
                                onClick={() => handleTabClick(tab.id)}
                                className={cn(
                                    'font-sf-pro font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full flex-shrink-0',
                                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#111827] focus-visible:outline-offset-2',
                                    'active:brightness-[0.97]',
                                    'mx-0.5',
                                    activeTab === tab.id && 'ring-2 ring-offset-2 ring-offset-transparent',
                                )}
                                style={{
                                    backgroundColor: activeTab === tab.id ? tab.hoverBgColor : tab.bgColor,
                                    color: tab.textColor,
                                    '--hover-bg': tab.hoverBgColor,
                                    '--ring-color': tab.textColor,
                                } as React.CSSProperties & { '--hover-bg': string; '--ring-color': string }}
                                onMouseEnter={(e) => {
                                    if (!prefersReducedMotion && activeTab !== tab.id) {
                                        e.currentTarget.style.backgroundColor = tab.hoverBgColor;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!prefersReducedMotion && activeTab !== tab.id) {
                                        e.currentTarget.style.backgroundColor = tab.bgColor;
                                    }
                                }}
                                type="button"
                                tabIndex={0}
                                aria-pressed={activeTab === tab.id}
                                aria-current={activeTab === tab.id ? 'page' : undefined}
                                aria-expanded={activeTab === tab.id}
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
                                    className="whitespace-nowrap text-xs sm:text-sm hidden md:inline ml-0.5 sm:ml-1"
                                    style={{ color: tab.textColor }}
                                >
                                    {tab.label}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </nav>
            </motion.div>

            {/* Suggested Questions Panel */}
            <AnimatePresence>
                {activeTabData && activeTab && (
                    <motion.div
                        initial={prefersReducedMotion ? {} : { opacity: 0, y: -10, scale: 0.95 }}
                        animate={prefersReducedMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
                        exit={prefersReducedMotion ? {} : { opacity: 0, y: -10, scale: 0.95 }}
                        transition={prefersReducedMotion ? {} : { duration: 0.3 }}
                        className="w-full max-w-2xl px-2 sm:px-0"
                    >
                        <div 
                            className="rounded-xl sm:rounded-2xl backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg p-4 sm:p-6"
                            style={{
                                backgroundColor: `${activeTabData.bgColor}40`, // 25% opacity
                            }}
                        >
                            <p className="text-xs sm:text-sm font-medium mb-3 sm:mb-4 text-center" style={{ color: activeTabData.textColor }}>
                                {activeTabData.description}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {activeTabData.suggestedQuestions.map((question, index) => (
                                    <motion.button
                                        key={index}
                                        onClick={() => handleQuestionClick(question)}
                                        className={cn(
                                            'text-left px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all',
                                            'hover:shadow-md active:scale-95',
                                            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
                                        )}
                                        style={{
                                            backgroundColor: activeTabData.bgColor,
                                            color: activeTabData.textColor,
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!prefersReducedMotion) {
                                                e.currentTarget.style.backgroundColor = activeTabData.hoverBgColor;
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!prefersReducedMotion) {
                                                e.currentTarget.style.backgroundColor = activeTabData.bgColor;
                                            }
                                        }}
                                        initial={prefersReducedMotion ? {} : { opacity: 0, x: -10 }}
                                        animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                                        transition={prefersReducedMotion ? {} : { delay: index * 0.05, duration: 0.2 }}
                                        whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                                        whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                                    >
                                        {question}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}