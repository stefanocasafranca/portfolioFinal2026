import Card from '../../ui/card';
import Image from 'next/image';
import Anchor from '../../ui/anchor';
import { FaArrowRight } from 'react-icons/fa6';
import { toKebabCase } from '@/utils/lib';

export default function DesignProcess() {
    const methodName = 'Design Process';

    return (
        <Card className="group relative flex items-center justify-center p-1 md:p-8">
            {/* Mobile: image only, covers full card with scale-90, no button */}
            <div className="w-full h-full flex items-center justify-center scale-90 md:hidden">
                <Image
                    src='/doubleDiamond.png'
                    alt='Double Diamond Design Process'
                    className='object-cover w-full h-full rounded-2xl'
                    fill
                    priority
                    draggable={false}
                />
            </div>
            {/* Desktop/Tablet: original layout with image and button */}
            <div className="hidden md:flex flex-col items-center justify-center w-full h-full gap-6">
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