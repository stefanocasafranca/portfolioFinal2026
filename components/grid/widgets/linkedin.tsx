import LinkCard from '../../ui/link-card';
import { FaLinkedin } from 'react-icons/fa6';
import DecorativeCTA from '../../ui/decorative-cta';

/**
 * Contact card component for LinkedIn profile link
 * Uses the 'contact' variant for consistent contact-related styling
 */
export default function LinkedIn() {
    return (
        <LinkCard 
            className='group relative'
            style={{backgroundColor: '#c9def6'}}
            href='https://linkedin.com/in/stefano-casafranca'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Visit LinkedIn Profile'
        >
            {/* Unified layout for all screens: centered title, icon button bottom left */}
            <div className='w-full h-full flex flex-col items-center justify-center relative p-4'>
                <h2 className='font-sf-pro text-2xl text-center w-full mb-0' title='LinkedIn'>
                    <span className='cancel-drag'>
                        LinkedIn
                    </span>
                </h2>
                <DecorativeCTA
                    className='size-10 flex items-center justify-center rounded-full bg-white shadow absolute left-3 bottom-3'
                >
                    <FaLinkedin className='text-black text-2xl' />
                </DecorativeCTA>
            </div>
        </LinkCard>
    );
}
