'use client';

import { motion } from 'framer-motion';
import { useUIMode } from '@/contexts/ui-mode';
import { usePrefersReducedMotion } from '@/utils/hooks';

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
            {/* Apple-style toggle in ON state (green) */}
            <button
                className="cancel-drag relative h-[31px] w-[51px] cursor-pointer rounded-full bg-[#34C759] transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2"
                onClick={exitAiMode}
                aria-label="Exit AI Portfolio mode"
                aria-pressed="true"
            >
                <span className="absolute top-[2px] left-[2px] h-[27px] w-[27px] translate-x-[20px] rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out" />
            </button>
        </motion.div>
    );
}