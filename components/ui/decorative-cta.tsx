import { cn } from '@/utils/lib';

interface DecorativeCTAProps extends React.HTMLAttributes<HTMLSpanElement> {
    className?: string;
    children: React.ReactNode;
}

export default function DecorativeCTA({ 
    className, 
    children, 
    ...props 
}: Readonly<DecorativeCTAProps>) {
    return (
        <span
            {...props}
            className={cn(
                'cancel-drag inline-flex items-center justify-center gap-3 overflow-hidden whitespace-nowrap rounded-full bg-white p-3 transition-all duration-300 pointer-events-none',
                'ring-2 ring-gray-200/45 dark:text-black dark:ring-gray-200/30',
                className
            )}
        >
            {children}
        </span>
    );
}