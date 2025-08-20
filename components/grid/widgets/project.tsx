import projectImage from '@/public/projects/next-blog-starter.png';
import LinkCard from '../../ui/link-card';
import Image from 'next/image';
import { toKebabCase } from '@/utils/lib';
import DecorativeCTA from '../../ui/decorative-cta';
import { FaArrowRight } from 'react-icons/fa6';

export default function Project() {
    const projectName = 'Next Blog Starter';

    return (
        <LinkCard 
            className='group relative bg-red-100'
            href={`/projects/${toKebabCase(projectName)}`}
            aria-label={`View ${projectName} project`}
        >
            <Image
                src={projectImage}
                alt={toKebabCase(projectName)}
                fill
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                className='object-cover'
                placeholder='blur'
                priority
                draggable='false'
            />
            <div className='absolute bottom-3 left-3'>
                <DecorativeCTA
                    className='size-10 justify-end transition-all ease-in-out group-hover:w-full'
                >
                    <span className='hidden whitespace-nowrap opacity-0 transition-all duration-300 ease-in group-hover:translate-x-0 group-hover:opacity-100 md:inline'>
                        {projectName}
                    </span>
                    <span>
                        <FaArrowRight className='-rotate-45 transition-transform duration-300 group-hover:rotate-0' />
                    </span>
                </DecorativeCTA>
            </div>
        </LinkCard>
    );
}
