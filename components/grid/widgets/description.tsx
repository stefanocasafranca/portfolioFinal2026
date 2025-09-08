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
                width={120}
                height={120}
                placeholder='blur'
                priority
                className='rounded-lg'
            />
            <p className='leading-relaxed text-sm sm:text-base'>
                Hi, I&apos;m <span className='font-sf-pro text-lg sm:text-xl font-semibold'>Stefano</span>, a <a href='https://jakobnielsenphd.substack.com/p/ux-unicorn' target='_blank' rel='noopener noreferrer' className='font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 underline decoration-dotted underline-offset-2 transition-colors'>UX Unicorn</a> who does Design, Research and Coding. I&apos;m ready to <span className='font-semibold'>pour my heart and soul</span> into crafting experiences that truly <span className='font-medium'>tackle big problems</span>.
            </p>
        </Card>
    );
}
