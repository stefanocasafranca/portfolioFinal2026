'use client';

import { useState } from 'react';
import { FaRegCopy, FaCheck, FaRegEnvelope } from 'react-icons/fa6';
import Card from '../../ui/card';

export default function Email() {
    const [copied, setCopied] = useState(false);
    const email = 'scasafrancal01@gmail.com';

    const handleCopy = async () => {
        await navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <Card className='group relative flex flex-col items-center justify-center bg-[#EA4335] dark:bg-[#B22222] active:scale-95 transition-transform'>
            <div className='flex flex-col items-center justify-center flex-1 gap-0 p-8 h-full w-full'>
                <div className='flex flex-1 items-center justify-center w-full'>
                    <FaRegEnvelope className='text-white text-6xl' aria-label='Email Icon' />
                </div>
                <button
                    onClick={handleCopy}
                    className='cancel-drag flex items-center justify-center rounded-full p-3 mt-6 bg-white/20 hover:bg-white/30 transition-colors text-white text-2xl focus:outline-none focus:ring-2 focus:ring-white/50'
                    aria-label='Copy Email Address'
                >
                    {copied ? <FaCheck className='text-green-300' /> : <FaRegCopy />}
                </button>
                {copied && <span className='text-green-200 text-xs mt-4'>Copied!</span>}
            </div>
        </Card>
    );
} 