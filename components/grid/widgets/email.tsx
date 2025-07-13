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
            {/* Mobile layout - IoMailOutline icon at top, copy button bottom left */}
            <div className="md:hidden flex flex-col items-center w-full h-full p-4 relative">
                <IoMailOutline className='text-4xl text-black mt-6 mb-0' aria-label='Email' />
                <button
                    className='cancel-drag size-10 flex items-center justify-center rounded-full bg-white absolute left-3 bottom-3 shadow transition active:scale-95'
                    onClick={handleCopy}
                    aria-label='Copy Email Address'
                >
                    {copied ? <FaCheck className='text-green-500' /> : <FaRegCopy className='text-black' />}
                </button>
            </div>

            {/* Desktop layout - full content */}
            <div className='hidden md:flex flex-col justify-center gap-6 p-8 h-full w-full'>
                <h2 className='font-sf-pro text-2xl' title='Email'>
                    <span className='cancel-drag'>
                        Email
                    </span>
                </h2>
                <p className='line-clamp-3 leading-relaxed max-md:line-clamp-4 max-sm:line-clamp-2'>
                    Let&apos;s connect! I&apos;m always open to discussing new opportunities, collaborations, or just having a chat about design and technology.
                </p>
                <small className='text-gray-600 dark:text-gray-400'>Open to opportunities</small>
                <div className='absolute bottom-3 left-3'>
                    <a
                        className='cancel-drag size-10 flex items-center justify-center rounded-full bg-white shadow transition active:scale-95'
                        href={`mailto:${email}`}
                        aria-label='Send email'>
                        <IoMailOutline className='text-black text-2xl' />
                    </a>
                </div>
            </div>
        </Card>
    );
} 