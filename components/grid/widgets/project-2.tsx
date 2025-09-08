import LinkCard from '../../ui/link-card';
import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa6';
import DecorativeCTA from '../../ui/decorative-cta';
import { toKebabCase } from '@/utils/lib';

export default function Project2() {
    const projectName = 'ABI';

    return (
        <LinkCard 
            className='group relative bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20'
            href={`/projects/${toKebabCase(projectName)}`}
            aria-label={`View ${projectName} project`}
        >
            <div className='relative w-full h-full'>
                <Image
                    src='/images/2ndCard_ABI_Mobile.png'
                    alt={toKebabCase(projectName)}
                    fill
                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                    className='object-cover block md:hidden'
                    priority
                    draggable='false'
                />
                <Image
                    src='/images/2ndCard_ABI_Tablet.png'
                    alt={toKebabCase(projectName)}
                    fill
                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                    className='object-cover hidden md:block lg:hidden'
                    priority
                    draggable='false'
                />
                <Image
                    src='/images/2ndCard_ABI_Desktop.png'
                    alt={toKebabCase(projectName)}
                    fill
                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                    className='object-cover hidden lg:block'
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