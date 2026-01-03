'use client';

import Card from '@/components/ui/card';
import Image from 'next/image';
import { IoOpenOutline } from 'react-icons/io5';

interface MethodImageWithLinkProps {
    imageUrl: string;
    alt: string;
    link?: string;
}

export default function MethodImageWithLink({
    imageUrl,
    alt,
    link,
}: MethodImageWithLinkProps) {
    return (
        <Card className='relative h-full'>
            <Image
                src={imageUrl}
                alt={alt}
                fill
                className='object-cover'
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                draggable={false}
            />
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
        </Card>
    );
}

