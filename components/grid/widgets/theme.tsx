'use client';

import { useMounted, usePrefersReducedMotion } from '@/utils/hooks';
import { cn } from '@/utils/lib';
import { useUIMode } from '@/contexts/ui-mode';
import { FaRobot } from 'react-icons/fa6';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Card from '../../ui/card';

export default function Theme() {
    const { isAiMode } = useUIMode();
    
    // In normal mode, this is the homepage card that enters AI mode
    // In AI mode, this component is not rendered (AI mode has its own exit toggle)
    if (isAiMode) {
        return null;
    }
    
    // Render normal homepage toggle card
    return (
        <Card className="relative flex h-full flex-col items-center justify-center">
            <ThemeToggle />
        </Card>
    );
}

function ThemeToggle() {
    const isMounted = useMounted();
    const { isAiMode, enterAiMode, isActivating } = useUIMode();
    const [useIconFallback, setUseIconFallback] = useState(false);

    const handleToggle = () => {
        // In normal mode, this enters AI mode
        if (isMounted && !isActivating) {
            enterAiMode();
        }
    };

    if (!isMounted) return null;

    // OFF state (default) - circle left, gray background
    // ACTIVATING state - circle moves right, purple background, icon activates
    // ON state (active) - circle right, gradient background
    const isOn = isAiMode || isActivating;

    return (
        <div className="relative">
            <button
                className={cn(
                    'cancel-drag flex h-10 w-20 cursor-pointer items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 lg:h-12 lg:w-24 shadow-lg hover:scale-105',
                    isActivating 
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600 animate-pulse' 
                        : isAiMode 
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600' 
                        : 'bg-[#E0E0E0]'
                )}
                onClick={handleToggle}
                disabled={isActivating}
                aria-label={isActivating ? 'Activating AI Portfolio...' : isOn ? 'Exit AI Portfolio mode' : 'Enter AI Portfolio mode'}
                aria-pressed={isOn}>
                <div
                    className={cn(
                        'flex size-10 items-center justify-center rounded-full border-2 transition-all duration-300 lg:size-12 lg:border-4 shadow-md',
                        isOn 
                            ? 'bg-white border-white/30 translate-x-full text-purple-600' 
                            : 'bg-white border-gray-200 text-gray-400 ring-1 ring-gray-300 ring-offset-0',
                        isActivating && 'animate-bounce'
                    )}
                    style={!isOn ? { 
                        boxShadow: '0 0 0 1px rgb(168 85 247), 0 0 0 2px rgb(209 213 219)'
                    } : undefined}>
                    {/* AI robot icon - gray when OFF, colored when ACTIVATING/ON */}
                    {!useIconFallback ? (
                        <Image
                            src="/images/icons/ai-toggle.svg"
                            alt="AI Portfolio"
                            width={20}
                            height={20}
                            className={cn(
                                "transition-all duration-300",
                                (isActivating || isAiMode) ? "opacity-100" : "opacity-60"
                            )}
                            onError={() => setUseIconFallback(true)}
                        />
                    ) : (
                        <FaRobot 
                            className={cn(
                                "w-5 h-5 transition-all duration-300",
                                (isActivating || isAiMode) ? "text-purple-600 animate-pulse" : "text-[#9E9E9E]"
                            )} 
                        />
                    )}
                </div>
            </button>
        </div>
    );
}
