import profile from '@/public/images/profile.png';
import Image from 'next/image';
import Card from '../../ui/card';
import { siteConfig } from '@/config/site';

/**
 * Hero card component - always visible and serves as the main introduction
 * Uses the 'hero' variant for special styling and layout emphasis
 */
export default function Description() {
    return (
        <Card 
            className='flex flex-col justify-center gap-2 sm:gap-4 p-4 sm:p-8'
        >
            <Image
                src={profile}
                alt={siteConfig.title}
                width={100}
                height={100}
                placeholder='blur'
                priority
                className='rounded-lg w-[85px] sm:w-[100px] h-auto'
            />
            <p className='leading-relaxed text-[14px] sm:text-[16px]'>
                Hi, I&apos;m <span className='font-sf-pro text-[18px] sm:text-[20px] font-semibold'>Stefano</span>. I will oversee the entire development process of digital or physical goods, from conceptualization to final production, ensuring that they are functional, user-friendly, and marketable! I&apos;ll <span className='font-semibold'>pour my heart and soul</span> ensuring pain points are no longer a problem.
            </p>
        </Card>
    );
}
