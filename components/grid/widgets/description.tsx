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
            <p className='leading-relaxed'>
                Hi, I&apos;m <span className='font-sf-pro text-xl'>Stefano</span>, a UX Designer and Researcher learning to code.{' '}
                <span className='hidden md:inline'>I am ready to high stress environments in order to build amazing products.</span>
            </p>
        </Card>
    );
}
