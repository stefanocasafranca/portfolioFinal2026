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
            {/* Mobile layout - title with breathing room, button bottom left */}
            <div className="md:hidden flex flex-col items-center w-full h-full p-4 relative">
                <h2 className='font-sf-pro text-2xl text-center w-full mt-6 mb-0' title='LinkedIn'>
                    <span className='cancel-drag'>
                        LinkedIn
                    </span>
                </h2>
                <Anchor
                    className='cancel-drag size-10 justify-end transition-all ease-in-out group-hover:w-full absolute left-3 bottom-3'
                    href='https://linkedin.com/in/stefano-casafranca'
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label='LinkedIn Profile'>
                    <span className='sr-only'>Connect</span>
                    <span>
                        <FaLinkedin className='transition-transform duration-300 group-hover:scale-110' />
                    </span>
                </Anchor>
            </div>

            {/* Desktop layout - full content */}
            <div className='hidden md:flex flex-col justify-center gap-6 p-8 h-full w-full'>
                <h2 className='font-sf-pro text-2xl' title='LinkedIn'>
                    <span className='cancel-drag'>
                        LinkedIn
                    </span>
                </h2>
                <p className='line-clamp-3 leading-relaxed max-md:line-clamp-4 max-sm:line-clamp-2'>
                    Connect with me on LinkedIn to stay updated with my professional journey and network with fellow designers and developers.
                </p>
                <small className='text-gray-600 dark:text-gray-400'>Professional Network</small>
                <div className='absolute bottom-3 left-3'>
                    <Anchor
                        className='cancel-drag size-10 justify-end transition-all ease-in-out group-hover:w-full'
                        href='https://linkedin.com/in/stefano-casafranca'
                        target='_blank'
                        rel='noopener noreferrer'
                        aria-label='LinkedIn Profile'>
                        <span className='hidden whitespace-nowrap opacity-0 transition-all duration-300 ease-in group-hover:translate-x-0 group-hover:opacity-100 md:inline'>
                            Connect
                        </span>
                        <span>
                            <FaLinkedin className='transition-transform duration-300 group-hover:scale-110' />
                        </span>
                    </Anchor>
                </div>
            </div>
        </Card>
    );
}
