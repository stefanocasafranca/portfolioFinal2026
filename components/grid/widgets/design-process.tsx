import LinkCard from '../../ui/link-card';
import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa6';
import DecorativeCTA from '../../ui/decorative-cta';
import { toKebabCase } from '@/utils/lib';

/**
 * Process card component showcasing design methodology
 * Uses the 'process' variant for consistent process-related styling
 */
export default function DesignProcess() {
    const methodName = 'Design Process';

    return (
        <LinkCard 
            className='group relative bg-white'
            href={`/methods/${toKebabCase(methodName)}`}
            aria-label={`View ${methodName} method`}
        >
            {/* Mobile layout - ONLY the image, covering the card */}
            <div className='md:hidden flex items-center justify-center w-full h-full p-1 overflow-hidden'>
                <div className='relative w-full h-full' style={{ transform: 'scale(1.3)' }}>
                    <Image
                        src='/images/WorkShop Design.png'
                        alt='Workshop Design Process'
                        className='object-contain w-full h-full'
                        fill
                        loading="lazy"
                        draggable={false}
                    />
                </div>
            </div>

            {/* Tablet layout - full size */}
            <div className='hidden md:flex lg:hidden flex-col items-center justify-center w-full h-full gap-6 p-1 overflow-hidden'>
                <div className='flex flex-1 items-center justify-center w-full h-full'>
                    <div className='relative w-full h-full' style={{ transform: 'scale(1.3)' }}>
                        <Image
                            src='/images/WorkShop Design.png'
                            alt='Workshop Design Process'
                            className='object-contain'
                            fill
                            loading="lazy"
                            draggable={false}
                        />
                    </div>
                </div>
            </div>

            {/* Large desktop layout - full size image */}
            <div className='hidden lg:flex flex-col items-center justify-center w-full h-full gap-6 p-1 overflow-hidden'>
                <div className='flex flex-1 items-center justify-center w-full h-full'>
                    <div className='relative w-full h-full' style={{ transform: 'scale(1.3)' }}>
                        <Image
                            src='/images/WorkShop Design.png'
                            alt='Workshop Design Process'
                            className='object-contain'
                            fill
                            loading="lazy"
                            draggable={false}
                        />
                    </div>
                </div>
            </div>

            {/* Button always visible on all screen sizes - positioned outside responsive divs */}
            <div className='absolute bottom-3 left-3 z-10'>
                <DecorativeCTA
                    className='size-10 justify-end transition-all ease-in-out group-hover:w-full'
                >
                    <span className='hidden whitespace-nowrap opacity-0 transition-all duration-300 ease-in group-hover:translate-x-0 group-hover:opacity-100 md:inline'>
                        Workshop Design
                    </span>
                    <span>
                        <FaArrowRight className='-rotate-45 transition-transform duration-300 group-hover:rotate-0' />
                    </span>
                </DecorativeCTA>
            </div>
        </LinkCard>
    );
} 