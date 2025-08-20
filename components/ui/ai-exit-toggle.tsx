'use client';

import { motion } from 'framer-motion';
import { FaRobot } from 'react-icons/fa6';
import { useUIMode } from '@/contexts/ui-mode';
import { usePrefersReducedMotion } from '@/utils/hooks';
import { cn } from '@/utils/lib';

export default function AIExitToggle() {
    const { exitAiMode } = useUIMode();
    const prefersReducedMotion = usePrefersReducedMotion();

    const animationProps = prefersReducedMotion ? {} : {
        initial: { opacity: 0, scale: 0.8, x: 20 },
        animate: { opacity: 1, scale: 1, x: 0 },
        transition: { duration: 0.4, delay: 0.3 }
    };

    return (
        <motion.div
            {...animationProps}
            className="flex items-center"
        >
            {/* Toggle button in ON state - same as homepage toggle but showing ON */}
            <button
                className="cancel-drag flex h-10 w-20 cursor-pointer items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 lg:h-12 lg:w-24 shadow-lg hover:scale-105 bg-gradient-to-r from-purple-500 to-indigo-600"
                onClick={exitAiMode}
                aria-label="Exit AI Portfolio mode"
                aria-pressed="true">
                <div
                    className="flex size-10 items-center justify-center rounded-full border-2 transition-all duration-300 lg:size-12 lg:border-4 shadow-md bg-white border-white/30 translate-x-full text-purple-600">
                    <FaRobot className="w-5 h-5 text-purple-600" />
                </div>
            </button>
        </motion.div>
    );
}