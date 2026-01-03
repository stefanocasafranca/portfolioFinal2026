'use client';

import Card from '@/components/ui/card';
import Image from 'next/image';
import { FiDownload } from 'react-icons/fi';

interface ProjectImageWithDownloadProps {
    imageUrl: string;
    alt: string;
    showDownload: boolean;
    pdfPath: string;
    pdfFilename: string;
}

export default function ProjectImageWithDownload({
    imageUrl,
    alt,
    showDownload,
    pdfPath,
    pdfFilename,
}: ProjectImageWithDownloadProps) {
    return (
        <Card className='relative'>
            <Image
                src={imageUrl}
                alt={alt}
                fill
                objectFit='cover'
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                draggable='false'
            />
            {showDownload && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        const link = document.createElement('a');
                        link.href = pdfPath;
                        link.download = pdfFilename;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }}
                    className='absolute bottom-3 left-3 z-10'
                    aria-label='Download UX Research PDF'
                >
                    <div className='size-10 flex items-center justify-center rounded-full bg-white shadow transition active:scale-95 hover:shadow-md'>
                        <FiDownload className='text-xl text-gray-700 hover:text-black transition-colors' />
                    </div>
                </button>
            )}
        </Card>
    );
}

