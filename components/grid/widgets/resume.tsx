'use client';

import Card from '../../ui/card';
import { FiDownload } from 'react-icons/fi';

/**
 * Resume card component
 * Shows a document icon, title, and download icon in the bottom left
 */
export default function Resume() {
    return (
        <Card variant="project" className="group relative flex flex-col items-center justify-start bg-white">
            {/* Text content at the top */}
            <div className="w-full flex flex-col items-center pt-4 pb-2">
                <span role="img" aria-label="Document" className="text-4xl mb-2">📄</span>
                <h2 className="font-sf-pro text-2xl text-center mb-1">Resume</h2>
            </div>
            {/* Download icon in the bottom left, styled like the email card's button */}
            <a
                href="/resume.pdf"
                download
                className="absolute bottom-3 left-3"
                aria-label="Download Resume PDF"
            >
                <div className="size-10 flex items-center justify-center rounded-full bg-white shadow transition active:scale-95">
                    <FiDownload className="text-xl text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors" />
                </div>
            </a>
        </Card>
    );
}
