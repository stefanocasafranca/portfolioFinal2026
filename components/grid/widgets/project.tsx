import LinkCard from '../../ui/link-card';
import Image from 'next/image';
import { toKebabCase } from '@/utils/lib';
import DecorativeCTA from '../../ui/decorative-cta';
import { FaArrowRight } from 'react-icons/fa6';

export default function Project() {
    const projectName = 'Fazil Auto';

    return (
        <LinkCard 
            className='group relative bg-white'
            href={`/projects/${toKebabCase(projectName)}`}
            aria-label={`View ${projectName} project`}
        >
            <div className='relative w-full h-full'>
                <Image
                    src='/images/1stCard_FazilAuto_Desktop-2.png'
                    alt={toKebabCase(projectName)}
                    fill
                    sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
                    className='object-cover block md:hidden'
                    priority
                    draggable='false'
                />
                <Image
                    src='/images/1stCard_FazilAuto_Desktop.png'
                    alt={toKebabCase(projectName)}
                    fill
                    sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
                    className='object-cover hidden md:block lg:hidden'
                    priority
                    draggable='false'
                />
                <Image
                    src='/images/1stCard_FazilAuto_Desktop.png'
                    alt={toKebabCase(projectName)}
                    fill
                    sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
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
                        AI Food Pick-Up App
                    </span>
                    <span>
                        <FaArrowRight className='-rotate-45 transition-transform duration-300 group-hover:rotate-0' />
                    </span>
                </DecorativeCTA>
            </div>
        </LinkCard>
    );
}
