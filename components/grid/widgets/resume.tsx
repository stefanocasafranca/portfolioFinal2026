'use client';

import Card from '../../ui/card';

export default function Resume() {
    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation();
        const link = document.createElement('a');
        link.href = '/resume.pdf';
        link.download = 'Stefano_Casafranca_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Card className='group relative flex flex-col items-center justify-center h-full active:scale-95 transition-transform'>
            <div className='flex flex-col items-center justify-center flex-1 gap-0 sm:gap-1 p-2 sm:p-8'>
                <span className='text-3xl text-dark-900 dark:text-white' aria-label='Resume' role='img'>📄</span>
                <h2 className='font-sf-pro text-2xl font-semibold text-dark-900 dark:text-white'>Resume</h2>
                <a
                    href='/resume.pdf'
                    download='Stefano_Casafranca_Resume.pdf'
                    className='cancel-drag flex items-center justify-center mt-4 text-dark-900 dark:text-white rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-dark-800'
                    onClick={handleDownload}
                    aria-label='Download Resume'
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className='text-dark-900 dark:text-white'><path d="M12 3v12m0 0l-4-4m4 4l4-4"/><rect x="4" y="19" width="16" height="2" rx="1"/></svg>
                </a>
            </div>
        </Card>
    );
}
