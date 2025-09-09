import { siteConfig } from '@/config/site';
import { sfPro } from '@/utils/fonts';
import { cn } from '@/utils/lib';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import { ThemeProvider } from './providers';

import './globals.css';

export const metadata: Metadata = {
    title: {
        default: 'Stefano Casafranca',
        template: '%s',
    },
    description: siteConfig.description,
    icons: {
        icon: [
            { url: '/favicon.ico' },
            { url: '/favicon.ico', sizes: '16x16', type: 'image/x-icon' },
            { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
        ],
        shortcut: '/favicon.ico',
        apple: '/favicon.ico',
    },
    openGraph: {
        title: 'Stefano Casafranca',
        description: siteConfig.description,
        url: siteConfig.url,
        siteName: 'Stefano Casafranca',
        locale: 'en-US',
        type: 'website',
        images: [
            {
                url: siteConfig.ogImage,
            },
        ],
    },
    twitter: {
        title: 'Stefano Casafranca',
        description: siteConfig.description,
        images: siteConfig.ogImage,
        card: 'summary_large_image',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    alternates: {
        canonical: siteConfig.url,
    },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang='en' suppressHydrationWarning>
                            <body className={cn('font-sf-pro', 'dark:bg-dark-900 bg-gray-100 antialiased')} suppressHydrationWarning>
                <ThemeProvider attribute='class' defaultTheme='light' enableSystem={false}>
                    {children}
                </ThemeProvider>
                <Analytics />
            </body>
        </html>
    );
}
