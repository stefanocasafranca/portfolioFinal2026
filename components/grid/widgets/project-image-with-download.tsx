'use client';

import Card from '@/components/ui/card';
import Image from 'next/image';
import { FiDownload } from 'react-icons/fi';
import { IoOpenOutline } from 'react-icons/io5';

interface ProjectImageWithDownloadProps {
    imageUrl: string;
    alt: string;
    showDownload: boolean;
    pdfPath: string;
    pdfFilename: string;
    link?: string; // Optional link for opening in new tab
    imageId?: string; // Image ID to identify specific tiles (e.g., 'images-7')
}

// Check if URL is a video file
function isVideoFile(url: string): boolean {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
}

export default function ProjectImageWithDownload({
    imageUrl,
    alt,
    showDownload,
    pdfPath,
    pdfFilename,
    link,
    imageId,
}: ProjectImageWithDownloadProps) {
    const isVideo = isVideoFile(imageUrl);
    // For images-7, use object-contain to maintain natural aspect ratio
    const useContain = isVideo && imageId === 'images-7';
    // For images-9 and images-11, add white border and background to remove black perimeter
    const hasWhiteBorder = imageId === 'images-9' || imageId === 'images-11';
    // Scale videos for images-9 and images-11 to eliminate black perimeter
    // images-9: 1.1x, images-11: 1.055x
    const videoScale = imageId === 'images-9' ? 1.1 : (imageId === 'images-11' ? 1.055 : 1);
    // Use white background for videos with white border instead of black
    const videoBgColor = hasWhiteBorder ? '!bg-white dark:!bg-white' : (isVideo ? '!bg-black dark:!bg-black' : '');
    
    const cardContent = (
        <Card className={`relative ${videoBgColor}`}>
            {isVideo ? (
                <video
                    src={imageUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className={`absolute inset-0 w-full h-full ${useContain ? 'object-contain' : 'object-cover'}`}
                    style={{ 
                        objectFit: useContain ? 'contain' : 'cover',
                        transform: `scale(${videoScale})`
                    }}
                />
            ) : (
                <Image
                    src={imageUrl}
                    alt={alt}
                    fill
                    className='object-cover'
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    draggable='false'
                />
            )}
            {showDownload && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        const downloadLink = document.createElement('a');
                        downloadLink.href = pdfPath;
                        downloadLink.download = pdfFilename;
                        document.body.appendChild(downloadLink);
                        downloadLink.click();
                        document.body.removeChild(downloadLink);
                    }}
                    className='absolute bottom-3 left-3 z-10'
                    aria-label='Download UX Research PDF'
                >
                    <div className='size-10 flex items-center justify-center rounded-full bg-white shadow transition active:scale-95 hover:shadow-md'>
                        <FiDownload className='text-xl text-gray-700 hover:text-black transition-colors' />
                    </div>
                </button>
            )}
            {link && (
                <a
                    href={link}
                    target='_blank'
                    rel='noopener noreferrer'
                    onClick={(e) => e.stopPropagation()}
                    className='absolute bottom-3 left-3 z-10'
                    aria-label={`Open ${alt} in new tab`}
                >
                    <div className='size-10 flex items-center justify-center rounded-full bg-white shadow transition active:scale-95 hover:shadow-md'>
                        <IoOpenOutline className='text-xl text-gray-700 hover:text-black transition-colors' />
                    </div>
                </a>
            )}
            {isVideo && imageId === 'images-6' && (
                <div className='absolute bottom-3 left-3 z-10'>
                    <div className='px-3 py-1.5 rounded-md bg-black/70 backdrop-blur-sm text-white text-xs font-medium'>
                        Time-lapse 28&apos; min
                    </div>
                </div>
            )}
        </Card>
    );

    return cardContent;
}

