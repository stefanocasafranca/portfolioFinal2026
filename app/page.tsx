'use client';

import Container from '@/components/ui/container';
import GridLayout from '@/components/grid/layout';
import { gridItems, layouts, filteredLayouts, CardCategory } from '@/config/grid';
import { siteConfig } from '@/config/site';
import GridItem from '@/components/grid/item';
import Navbar from '@/components/ui/navbar';
import Header from '@/components/ui/header';
import AIPortfolio from '@/components/ai-portfolio';
import { useUIMode } from '@/contexts/ui-mode';
import { usePrefersReducedMotion } from '@/utils/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function Home() {
    // Lightweight state management for filtering - following directives
    const [selectedCategory, setSelectedCategory] = useState<CardCategory | 'all'>('all');
    const { isAiMode, isAnimating } = useUIMode();
    const prefersReducedMotion = usePrefersReducedMotion();

    const getTransitionProps = (isAiPortfolio = false) => {
        if (prefersReducedMotion) return {};
        
        if (isAiPortfolio) {
            return {
                initial: { opacity: 0, scale: 0.9, y: 50 },
                animate: { 
                    opacity: 1, 
                    scale: 1, 
                    y: 0,
                    transition: { 
                        duration: 0.6, 
                        ease: [0.22, 1, 0.36, 1]
                    }
                },
                exit: { 
                    opacity: 0, 
                    scale: 0.95, 
                    y: -30,
                    transition: { duration: 0.4 }
                }
            };
        }
        
        return {
            initial: { opacity: 0, scale: 1.05, y: -30 },
            animate: { 
                opacity: 1, 
                scale: 1, 
                y: 0,
                transition: { 
                    duration: 0.5, 
                    ease: [0.22, 1, 0.36, 1]
                }
            },
            exit: { 
                opacity: 0, 
                scale: 0.95, 
                y: 50,
                transition: { duration: 0.4 }
            }
        };
    };

    return (
        <div className="relative min-h-screen">
            <AnimatePresence mode="wait">
                {isAiMode ? (
                    // AI Portfolio Mode - completely separate component tree
                    <motion.div
                        key="ai-portfolio"
                        {...getTransitionProps(true)}
                        className="absolute inset-0"
                    >
                        <AIPortfolio />
                    </motion.div>
                ) : (
                    // Normal Portfolio Mode - unmounted when in AI mode
                    <motion.div
                        key="main-portfolio"
                        {...getTransitionProps(false)}
                        className="relative"
                    >
                        {/* Combined Header and Navbar */}
                        <div className="max-w-[1200px] max-lg:max-w-[800px] max-md:max-w-[375px] max-sm:max-w-[320px] mx-auto px-4 py-6">
                            {/* Desktop Layout: Logo left, Navbar truly centered */}
                            <div className="hidden md:flex items-center mb-8">
                                {/* Logo on the left - fixed width */}
                                <div className="w-20 lg:w-24">
                                    <Header />
                                </div>
                                {/* Navbar centered - takes remaining space */}
                                <div className="flex-1 flex justify-center">
                                    <Navbar 
                                        selectedCategory={selectedCategory} 
                                        onCategoryChange={setSelectedCategory} 
                                    />
                                </div>
                                {/* Empty space on right to balance logo - same width */}
                                <div className="w-20 lg:w-24"></div>
                            </div>
                            
                            {/* Mobile Layout: Logo and Navbar stacked, both centered */}
                            <div className="flex md:hidden flex-col items-center gap-6 mb-8">
                                {/* Logo centered */}
                                <div className="flex justify-center">
                                    <Header />
                                </div>
                                {/* Navbar centered */}
                                <div className="flex justify-center">
                                    <Navbar 
                                        selectedCategory={selectedCategory} 
                                        onCategoryChange={setSelectedCategory} 
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <h1 className='hidden'>{siteConfig.title}</h1>
                        <main className='py-8'>
                            <GridLayout layouts={filteredLayouts[selectedCategory as keyof typeof filteredLayouts] || filteredLayouts.all}>
                                {gridItems.map((item) => (
                                    <GridItem 
                                        key={item.i} 
                                        id={item.i} 
                                        component={item.component}
                                        category={item.category}
                                        isHero={item.isHero}
                                        selectedCategory={selectedCategory}
                                    />
                                ))}
                            </GridLayout>
                        </main>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
