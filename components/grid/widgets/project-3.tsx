import LinkCard from '../../ui/link-card';
import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa6';
import DecorativeCTA from '../../ui/decorative-cta';
import { toKebabCase } from '@/utils/lib';

export default function Project3() {
    const projectName = 'CLE';

    return (
        <LinkCard 
            className='group relative bg-gradient-to-br from-green-100 to-yellow-100 dark:from-green-900/20 dark:to-yellow-900/20'
            href={`/projects/${toKebabCase(projectName)}`}
            aria-label={`View ${projectName} project`}
        >
            <div className='relative w-full h-full'>
                <Image
                    src='/images/3rdCard_CLE_Desktop&Tablet-1.png'
                    alt={toKebabCase(projectName)}
                    fill
                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                    className='object-cover block md:hidden'
                    priority
                    draggable='false'
                />
                <Image
                    src='/images/3rdCard_CLE_Desktop&Tablet.png'
                    alt={toKebabCase(projectName)}
                    fill
                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                    className='object-cover hidden md:block'
                    priority
                    draggable='false'
                />
            </div>
            <div className='absolute bottom-3 left-3'>
                <DecorativeCTA
                    className='size-10 justify-end transition-all ease-in-out group-hover:w-full'
                >
                    <span className='hidden whitespace-nowrap opacity-0 transition-all duration-300 ease-in group-hover:translate-x-0 group-hover:opacity-100 md:inline'>
                        View Project
                    </span>
                    <span>
                        <FaArrowRight className='-rotate-45 transition-transform duration-300 group-hover:rotate-0' />
                    </span>
                </DecorativeCTA>
            </div>
        </LinkCard>
    );
} 