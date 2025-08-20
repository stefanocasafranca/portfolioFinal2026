'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useUIMode } from '@/contexts/ui-mode';
import { useMounted, usePrefersReducedMotion } from '@/utils/hooks';
import AIExitToggle from './ai-exit-toggle';
import { useState } from 'react';

export default function Header() {
    const { isAiMode } = useUIMode();
    const isMounted = useMounted();
    const prefersReducedMotion = usePrefersReducedMotion();
    const [useLogoFallback, setUseLogoFallback] = useState(false);

    if (!isMounted) return null;

    // Always use white logo variant as specified
    const logoSrc = '/images/personalLogoWhite.png';

    const animationProps = prefersReducedMotion ? {} : {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: isAiMode ? 0.2 : 0 }
    };

    if (isAiMode) {
        // AI mode - only toggle, centered (logo is handled separately in AI Portfolio)
        return (
            <motion.div 
                className="flex justify-center"
                initial={prefersReducedMotion ? {} : { opacity: 0, y: -20 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                transition={prefersReducedMotion ? {} : { delay: 0.2, duration: 0.5 }}
            >
                <AIExitToggle />
            </motion.div>
        );
    }

    // Normal mode - logo in flex layout, aligned with navbar center
    return (
        <motion.div 
            className="flex items-center"
            initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
            transition={prefersReducedMotion ? {} : { delay: 0.1, duration: 0.5 }}
            {...animationProps}
        >
            <div className="w-16 h-16 lg:w-20 lg:h-20 relative">
                <Image
                    src={logoSrc}
                    alt="Stefano Casafranca's Personal Logo"
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 1024px) 64px, 80px"
                    onError={() => setUseLogoFallback(true)}
                />
            </div>
        </motion.div>
    );
}