'use client';

import Card from '../../ui/card';
import { FaEnvelope } from 'react-icons/fa6';
import Anchor from '../../ui/anchor';

/**
 * Contact card component for email interaction
 * Uses the 'contact' variant for consistent contact-related styling
 */
export default function Email() {
    return (
        <Card 
            variant="contact"
            className='group relative bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20'
        >
            <div className='flex flex-col justify-center gap-6 p-8'>
                <h2 className='font-sf-pro text-2xl' title='Email'>
                    <span className='cancel-drag'>
                        Email
                    </span>
                </h2>
                <p className='line-clamp-3 leading-relaxed max-md:line-clamp-4 max-sm:line-clamp-2'>
                    Let&apos;s connect! I&apos;m always open to discussing new opportunities, collaborations, or just having a chat about design and technology.
                </p>
                <small className='text-gray-600 dark:text-gray-400'>Open to opportunities</small>
            </div>
            <div className='absolute bottom-3 left-3'>
                <Anchor
                    className='cancel-drag size-10 justify-end transition-all ease-in-out group-hover:w-full'
                    href='mailto:stefano@example.com'
                    aria-label='Send email'>
                    <span className='hidden whitespace-nowrap opacity-0 transition-all duration-300 ease-in group-hover:translate-x-0 group-hover:opacity-100 md:inline'>
                        Send Email
                    </span>
                    <span>
                        <FaEnvelope className='transition-transform duration-300 group-hover:scale-110' />
                    </span>
                </Anchor>
            </div>
        </Card>
    );
} 