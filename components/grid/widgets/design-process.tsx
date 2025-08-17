import Card from '../../ui/card';
import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa6';
import Anchor from '../../ui/anchor';
import { toKebabCase } from '@/utils/lib';

/**
 * Process card component showcasing design methodology
 * Uses the 'process' variant for consistent process-related styling
 */
export default function DesignProcess() {
    const methodName = 'Design Process';

    return (
        <Card 
            className='group relative bg-white'
        >
            {/* Mobile layout - ONLY the image, covering the card */}
            <div className='md:hidden flex items-center justify-center w-full h-full p-2'>
                <Image
                    src='/doubleDiamond.png'
                    alt='Double Diamond Design Process'
                    className='object-contain w-full h-full'
                    fill
                    priority
                    draggable={false}
                />
            </div>

            {/* Desktop layout - full diagram view with text and button */}
            <div className='hidden md:flex flex-col items-center justify-center w-full h-full gap-6'>
                <div className='flex flex-1 items-center justify-center w-full h-full'>
                    <Image
                        src='/doubleDiamond.png'
                        alt='Double Diamond Design Process'
                        className='object-contain'
                        style={{ maxHeight: '80%', width: '100%' }}
                        width={400}
                        height={400}
                        priority
                        draggable={false}
                    />
                </div>
                <div className='absolute bottom-3 left-3'>
                    <Anchor
                        className='cancel-drag size-10 justify-end transition-all ease-in-out group-hover:w-full'
                        href={`/methods/${toKebabCase(methodName)}`}
                        aria-label={methodName}>
                        <span className='hidden whitespace-nowrap opacity-0 transition-all duration-300 ease-in group-hover:translate-x-0 group-hover:opacity-100 md:inline'>
                            View Method
                        </span>
                        <span>
                            <FaArrowRight className='-rotate-45 transition-transform duration-300 group-hover:rotate-0' />
                        </span>
                    </Anchor>
                </div>
            </div>
        </Card>
    );
} 