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
            <div className='md:hidden flex items-center justify-center w-full h-full p-1 relative' style={{ position: 'relative' }}>
                <Image
                    src='/images/WorkShop Design.png'
                    alt='Workshop Design Process'
                    className='object-contain w-full h-full'
                    fill
                    sizes="(max-width: 800px) 100vw, 50vw"
                    loading="lazy"
                    draggable={false}
                />
            </div>

            {/* Tablet layout - full size */}
            <div className='hidden md:flex lg:hidden flex-col items-center justify-center w-full h-full gap-6 p-1'>
                <div className='flex flex-1 items-center justify-center w-full h-full relative' style={{ position: 'relative' }}>
                    <Image
                        src='/images/WorkShop Design.png'
                        alt='Workshop Design Process'
                        className='object-contain'
                        fill
                        sizes="(max-width: 1200px) 50vw, 33vw"
                        loading="lazy"
                        draggable={false}
                    />
                </div>
            </div>

            {/* Large desktop layout - full size image */}
            <div className='hidden lg:flex flex-col items-center justify-center w-full h-full gap-6 p-1'>
                <div className='flex flex-1 items-center justify-center w-full h-full relative' style={{ position: 'relative' }}>
                    <Image
                        src='/images/WorkShop Design.png'
                        alt='Workshop Design Process'
                        className='object-contain'
                        fill
                        sizes="33vw"
                        loading="lazy"
                        draggable={false}
                    />
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