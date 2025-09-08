'use client';

import LinkCard from '../../ui/link-card';
import { FiDownload } from 'react-icons/fi';

/**
 * Resume card component
 * Shows a document icon, title, and download icon in the bottom left
 */
export default function Resume() {
    return (
        <LinkCard 
            className='group relative flex flex-col items-center justify-center'
            style={{backgroundColor: '#e9edf2'}}
            href='/resume.pdf'
            target='_blank'
            aria-label='View Resume PDF'
        >
            {/* Vertically centered content */}
            <div className='w-full flex flex-col items-center justify-center flex-grow gap-2'>
                <span role='img' aria-label='Document' className='text-4xl'>📄</span>
                <h2 className='font-sf-pro text-2xl text-center text-black dark:text-white'>Resume</h2>
            </div>
            {/* Download icon in the bottom left - decorative button with download functionality */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    const link = document.createElement('a');
                    link.href = '/resume.pdf';
                    link.download = 'stefano-casafranca-resume.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }}
                className='absolute bottom-3 left-3 z-10'
                aria-label='Download Resume PDF'
            >
                <div className='size-10 flex items-center justify-center rounded-full bg-white shadow transition active:scale-95 hover:shadow-md'>
                    <FiDownload className='text-xl text-gray-700 hover:text-black transition-colors' />
                </div>
            </button>
        </LinkCard>
    );
}
