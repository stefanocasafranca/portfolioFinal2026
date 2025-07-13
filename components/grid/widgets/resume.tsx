'use client';

import Card from '../../ui/card';
import { FiDownload } from 'react-icons/fi';

/**
 * Resume card component
 * Shows a document icon, title, and download icon in the bottom left
 */
export default function Resume() {
    return (
        <Card variant="project" className="group relative flex flex-col items-center justify-center bg-white dark:bg-gray-900">
            {/* Vertically centered content */}
            <div className="w-full flex flex-col items-center justify-center flex-grow">
                <span role="img" aria-label="Document" className="text-4xl mb-1 md:mb-2">📄</span>
                <h2 className="font-sf-pro text-2xl text-center mb-8 md:mb-12 mt-0 md:mt-8 text-black dark:text-white">Resume</h2>
            </div>
            {/* Download icon in the bottom left, styled like the email card's button */}
            <a
                href="/resume.pdf"
                download
                className="absolute bottom-3 left-3"
                aria-label="Download Resume PDF"
            >
                <div className="size-10 flex items-center justify-center rounded-full bg-white shadow transition active:scale-95">
                    <FiDownload className="text-xl text-gray-700 hover:text-black transition-colors" />
                </div>
            </a>
        </Card>
    );
}
