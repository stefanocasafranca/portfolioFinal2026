import { cn } from '@/utils/lib';
import Link from 'next/link';
import { forwardRef } from 'react';

interface LinkCardProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    children: React.ReactNode;
    href: string;
    target?: string;
    rel?: string;
    'aria-label'?: string;
}

const LinkCard = forwardRef<HTMLAnchorElement, LinkCardProps>(({ 
    className, 
    children, 
    href,
    target,
    rel,
    'aria-label': ariaLabel,
    ...props 
}, ref) => {
    return (
        <Link
            ref={ref}
            href={href}
            target={target}
            rel={rel}
            aria-label={ariaLabel}
            className={cn(
                'block size-full rounded-3xl shadow-xs transition-all duration-300 hover:shadow-lg cursor-pointer',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600',
                'active:scale-[0.98]'
            )}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.currentTarget.click();
                }
            }}
        >
            <div
                {...props}
                className={cn(
                    'size-full overflow-hidden rounded-3xl',
                    'bg-white dark:bg-dark-900',
                    'select-none',
                    'dark:ring-1 dark:ring-dark-800',
                    className
                )}>
                {children}
            </div>
        </Link>
    );
});

LinkCard.displayName = 'LinkCard';

export default LinkCard;