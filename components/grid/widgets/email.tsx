'use client';

import LinkCard from '../../ui/link-card';
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

    const handleCopy = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <LinkCard 
            className='group relative flex flex-col items-center justify-center'
            style={{backgroundColor: '#fcfcfc'}}
            href={`mailto:${email}`}
            aria-label='Send Email'
        >
            {/* Vertically centered content */}
            <div className='w-full flex flex-col items-center justify-center flex-grow gap-2'>
                <span role='img' aria-label='Email' className='text-5xl'>✉️</span>
                <h2 className='font-sf-pro text-2xl text-center text-black dark:text-white'>E-mail</h2>
            </div>
                
            {/* Copy button in bottom left */}
            <button
                className='cancel-drag size-10 flex items-center justify-center rounded-full bg-white absolute left-3 bottom-3 shadow transition active:scale-95 z-10'
                onClick={handleCopy}
                aria-label='Copy Email Address'
            >
                {copied ? <FaCheck className='text-green-500' /> : <FaRegCopy className='text-black' />}
            </button>
        </LinkCard>
    );
} 