import LinkCard from '../../ui/link-card';
import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa6';
import DecorativeCTA from '../../ui/decorative-cta';
import { toKebabCase } from '@/utils/lib';

export default function Project3() {
    const projectName = 'ACC Bioscience Incubator Website Redesign';

    return (
        <LinkCard 
            className='group relative bg-white'
            href={`/projects/${toKebabCase(projectName)}`}
            aria-label={`View ${projectName} project`}
        >
            <div className='relative w-full h-full'>
                <Image
                    src='/images/NewCardABI_Desktop & Tablet.png'
                    alt={toKebabCase(projectName)}
                    fill
                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
                    className='object-cover object-center'
                    loading="lazy"
                    draggable='false'
                />
            </div>
            <div className='absolute bottom-3 left-3'>
                <DecorativeCTA
                    className='size-10 justify-end transition-all ease-in-out group-hover:w-full'
                >
                    <span className='hidden whitespace-nowrap opacity-0 transition-all duration-300 ease-in group-hover:translate-x-0 group-hover:opacity-100 md:inline'>
                        Website Redesign
                    </span>
                    <span>
                        <FaArrowRight className='-rotate-45 transition-transform duration-300 group-hover:rotate-0' />
                    </span>
                </DecorativeCTA>
            </div>
        </LinkCard>
    );
} 