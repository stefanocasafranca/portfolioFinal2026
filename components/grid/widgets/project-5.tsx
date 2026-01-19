import LinkCard from '../../ui/link-card';
import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa6';
import DecorativeCTA from '../../ui/decorative-cta';
import { toKebabCase } from '@/utils/lib';

export default function Project5() {
    const projectName = 'Code Learning Evolution';

    return (
        <LinkCard 
            className='group relative bg-white'
            href="/projects/cle"
            aria-label={`View ${projectName} project`}
        >
            <div className='relative w-full h-full'>
                <Image
                    src='/images/3rdCard_CLE_Desktop&Tablet&Phone.png'
                    alt={toKebabCase(projectName)}
                    fill
                    sizes='(max-width: 640px) 100vw, (max-width: 1999px) 50vw, 50vw'
                    className='object-cover object-center block md:hidden'
                    priority
                    draggable='false'
                />
                <Image
                    src='/images/3rdCard_CLE_Tablet-1.png'
                    alt={toKebabCase(projectName)}
                    fill
                    sizes='(max-width: 640px) 100vw, (max-width: 1199px) 50vw, 50vw'
                    className='object-cover object-center hidden md:block [@media(min-width:1200px)]:!hidden'
                    loading="lazy"
                    draggable='false'
                />
                <Image
                    src='/images/3rdCard_CLE_Desktop&Tablet&Phone.png'
                    alt={toKebabCase(projectName)}
                    fill
                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw'
                    className='object-cover object-center !hidden [@media(min-width:1200px)]:!block'
                    priority
                    draggable='false'
                />
            </div>
            <div className='absolute bottom-3 left-3'>
                <DecorativeCTA
                    className='size-10 justify-end transition-all ease-in-out group-hover:w-full'
                >
                    <span className='hidden whitespace-nowrap opacity-0 transition-all duration-300 ease-in group-hover:translate-x-0 group-hover:opacity-100 md:inline'>
                        UX Design/Research
                    </span>
                    <span>
                        <FaArrowRight className='-rotate-45 transition-transform duration-300 group-hover:rotate-0' />
                    </span>
                </DecorativeCTA>
            </div>
        </LinkCard>
    );
}

