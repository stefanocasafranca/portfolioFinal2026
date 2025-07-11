'use client';

import Card from '../../ui/card';
import Anchor from '../../ui/anchor';

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
        <Card className='flex flex-col justify-center items-center h-full p-8 transition-colors cursor-pointer'>
            <div className='flex flex-col items-center justify-center flex-1 gap-3'>
                <span className='text-3xl' aria-label='Resume' role='img'>📄</span>
                <h2 className='font-sf-pro text-2xl font-semibold'>Resume</h2>
            </div>
            <div className='flex justify-center mt-6'>
                <a
                    href='/resume.pdf'
                    download='Stefano_Casafranca_Resume.pdf'
                    className='cancel-drag px-4 py-2'
                    onClick={handleDownload}
                >
                    <span className='inline-flex items-center gap-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12m0 0l-4-4m4 4l4-4"/><rect x="4" y="19" width="16" height="2" rx="1"/></svg>
                        Download
                    </span>
                </a>
            </div>
        </Card>
    );
}
