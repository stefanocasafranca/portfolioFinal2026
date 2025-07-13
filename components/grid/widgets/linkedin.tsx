import Card from '../../ui/card';
import { FaLinkedin } from 'react-icons/fa6';
import Anchor from '../../ui/anchor';

/**
 * Contact card component for LinkedIn profile link
 * Uses the 'contact' variant for consistent contact-related styling
 */
export default function LinkedIn() {
    return (
        <Card 
            variant="contact"
            className='group relative bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20'
        >
            {/* Unified layout for all screens: centered title, icon button bottom left */}
            <div className="w-full h-full flex flex-col items-center justify-center relative p-4">
                <h2 className='font-sf-pro text-2xl text-center w-full mt-6 mb-0' title='LinkedIn'>
                    <span className='cancel-drag'>
                        LinkedIn
                    </span>
                </h2>
                <Anchor
                    className='cancel-drag size-10 flex items-center justify-center rounded-full bg-white shadow absolute left-3 bottom-3 active:scale-95'
                    href='https://linkedin.com/in/stefano-casafranca'
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label='LinkedIn Profile'>
                    <FaLinkedin className='text-black text-2xl' />
                </Anchor>
            </div>
        </Card>
    );
}
