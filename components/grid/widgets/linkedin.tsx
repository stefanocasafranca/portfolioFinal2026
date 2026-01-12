import LinkCard from '../../ui/link-card';
import Image from 'next/image';
import { IoOpenOutline } from 'react-icons/io5';

/**
 * Contact card component for GitHub profile link
 * Uses the 'contact' variant for consistent contact-related styling
 */
export default function LinkedIn() {
    return (
        <LinkCard 
            className='group relative'
            style={{backgroundColor: '#fafbfc'}}
            href='https://github.com/stefanocasafranca'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Visit GitHub Profile'
        >
            {/* Unified layout for all screens: centered GitHub logo */}
            <div className='w-full h-full flex flex-col items-center justify-center relative p-4'>
                <div className='relative w-24 h-24 md:w-32 md:h-32' style={{ transform: 'scale(0.7)' }}>
                    <Image
                        src='/images/githubLogo.png'
                        alt='GitHub'
                        fill
                        className='object-contain'
                        loading="lazy"
                        draggable='false'
                    />
                </div>
            </div>
            {/* Icon positioned at bottom-left, matching design process modal style */}
            <div className='absolute bottom-3 left-3 z-10'>
                <div className='size-10 flex items-center justify-center rounded-full bg-white shadow transition active:scale-95 hover:shadow-md'>
                    <IoOpenOutline className='text-xl text-gray-700 hover:text-black transition-colors' />
                </div>
            </div>
        </LinkCard>
    );
}
