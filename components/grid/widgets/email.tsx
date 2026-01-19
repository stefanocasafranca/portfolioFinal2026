'use client';

import Card from '../../ui/card';
import { FaRegCopy, FaCheck } from 'react-icons/fa6';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Contact card component for email interaction
 * Clicking anywhere on the card copies the email to clipboard
 */
export default function Email() {
    const email = 'scasafrancal01@gmail.com';
    const [copied, setCopied] = useState(false);

    const handleCopy = async (e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
        }
        try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            // Silently handle errors - don't log to console in production
            if (process.env.NODE_ENV === 'development') {
                console.error('Failed to copy email:', err);
            }
        }
    };

    return (
        <Card 
            className='group relative flex flex-col items-center justify-center cursor-pointer active:scale-[0.98] transition-transform'
            style={{backgroundColor: '#fcfcfc'}}
            onClick={handleCopy}
            role='button'
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCopy();
                }
            }}
            aria-label='Copy Email Address'
        >
            {/* Vertically centered content */}
            <div className='w-full flex flex-col items-center justify-center flex-grow gap-2'>
                <span role='img' aria-label='Email' className='text-5xl'>✉️</span>
                <h2 className='font-sf-pro text-2xl text-center text-black dark:text-white'>E-mail</h2>
            </div>
                
            {/* Copy button in bottom left - hidden when copied */}
            {!copied && (
                <button
                    className='cancel-drag size-10 flex items-center justify-center rounded-full bg-white absolute left-3 bottom-3 shadow transition active:scale-95 z-10'
                    onClick={handleCopy}
                    aria-label='Copy Email Address'
                >
                    <FaRegCopy className='text-black' />
                </button>
            )}

            {/* Feedback message - overlaps button position */}
            <AnimatePresence>
                {copied && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 5 }}
                        transition={{ 
                            duration: 0.3,
                            ease: [0.16, 1, 0.3, 1] // Custom easing for smooth animation
                        }}
                        className='absolute bottom-3 left-3 z-20 pointer-events-none'
                    >
                        <div className='flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/90 text-white shadow-lg backdrop-blur-sm whitespace-nowrap'>
                            <FaCheck className='text-sm' />
                            <span className='text-sm font-medium'>Email copied!</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
} 