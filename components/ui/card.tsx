import { cn } from '@/utils/lib';

// Define card variants for flexible layout control
export type CardVariant = 'hero' | 'map' | 'process' | 'project' | 'contact';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    children: React.ReactNode;
    variant?: CardVariant; // Optional variant for layout control
}

export default function Card({ 
    className, 
    children, 
    variant = 'project', // Default variant
    ...props 
}: Readonly<CardProps>) {
    return (
        <div className='size-full rounded-3xl shadow-xs transition-shadow duration-300 hover:shadow-lg'>
            <div
                {...props}
                className={cn(
                    'size-full overflow-hidden rounded-3xl',
                    'bg-white dark:bg-dark-900',
                    'select-none md:cursor-grab md:active:cursor-grabbing',
                    'dark:ring-1 dark:ring-dark-800',
                    // Variant-specific styling can be added here
                    variant === 'hero' && 'ring-2 ring-blue-200/50',
                    variant === 'contact' && 'ring-2 ring-green-200/50',
                    variant === 'process' && 'ring-2 ring-purple-200/50',
                    className
                )}>
                {children}
            </div>
        </div>
    );
}
