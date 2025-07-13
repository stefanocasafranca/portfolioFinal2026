'use client';

import Card from '../../ui/card';
import { FaRegCopy, FaCheck } from 'react-icons/fa6';
import { IoMailOutline } from 'react-icons/io5';
import { useState } from 'react';

/**
 * Contact card component for email interaction
 * Uses the 'contact' variant for consistent contact-related styling
 */
export default function Email() {
    const email = 'scasafrancal01@gmail.com';
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <Card 
            variant="contact"
            className='group relative bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20'
        >
            {/* Centered Apple Mail icon */}
            <div className="w-full h-full flex items-center justify-center relative">
                <IoMailOutline className='text-6xl text-black dark:text-white' aria-label='Email' />
                
                {/* Copy button in bottom left */}
                <button
                    className='cancel-drag size-10 flex items-center justify-center rounded-full bg-white absolute left-3 bottom-3 shadow transition active:scale-95'
                    onClick={handleCopy}
                    aria-label='Copy Email Address'
                >
                    {copied ? <FaCheck className='text-green-500' /> : <FaRegCopy className='text-black' />}
                </button>
            </div>
        </Card>
    );
} 