import Card from '../../ui/card';
import { FaArrowRight } from 'react-icons/fa6';
import Anchor from '../../ui/anchor';
import { toKebabCase } from '@/utils/lib';

export default function Project3() {
    const projectName = 'Project Three';

    return (
        <Card className='group relative bg-gradient-to-br from-green-100 to-yellow-100 dark:from-green-900/20 dark:to-yellow-900/20'>
            <div className='flex flex-col justify-center gap-6 p-8'>
                <h2 className='font-sf-pro text-2xl' title={projectName}>
                    <span className='cancel-drag'>
                        {projectName}
                    </span>
                </h2>
                <p className='line-clamp-3 leading-relaxed max-md:line-clamp-4 max-sm:line-clamp-2'>
                    A horizontal bento card for the Project Three, styled to match the Portfolio Website card. Update this description as needed.
                </p>
                <small className='text-gray-600 dark:text-gray-400'>Next.js • React • Tailwind</small>
            </div>
            <div className='absolute bottom-3 left-3'>
                <Anchor
                    className='cancel-drag size-10 justify-end transition-all ease-in-out group-hover:w-full'
                    href={`/projects/${toKebabCase(projectName)}`}
                    aria-label={projectName}>
                    <span className='hidden whitespace-nowrap opacity-0 transition-all duration-300 ease-in group-hover:translate-x-0 group-hover:opacity-100 md:inline'>
                        View Project
                    </span>
                    <span>
                        <FaArrowRight className='-rotate-45 transition-transform duration-300 group-hover:rotate-0' />
                    </span>
                </Anchor>
            </div>
        </Card>
    );
} 