import LinkCard from '../../ui/link-card';
import { FaArrowRight } from 'react-icons/fa6';
import DecorativeCTA from '../../ui/decorative-cta';
import { toKebabCase } from '@/utils/lib';

export default function Project2() {
    const projectName = 'Portfolio Website';

    return (
        <LinkCard 
            className='group relative bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20'
            href={`/projects/${toKebabCase(projectName)}`}
            aria-label={`View ${projectName} project`}
        >
            <div className='flex flex-col justify-center gap-6 p-8'>
                <h2 className='font-sf-pro text-2xl' title={projectName}>
                    <span className='cancel-drag'>
                        {projectName}
                    </span>
                </h2>
                <p className='line-clamp-3 leading-relaxed max-md:line-clamp-4 max-sm:line-clamp-2'>
                    A modern, responsive portfolio website built with Next.js 15, React 19, and Tailwind CSS. Features a bento-style grid layout with smooth animations and mobile-first design.
                </p>
                <small className='text-gray-600 dark:text-gray-400'>Next.js • React • Tailwind</small>
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