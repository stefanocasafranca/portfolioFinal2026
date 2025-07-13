import { CardCategory } from '@/config/grid';
import { cn } from '@/utils/lib';

interface GridItemProps {
    component: React.ComponentType<any>;
    id: string;
    category: CardCategory;
    isHero?: boolean;
    selectedCategory: CardCategory | 'all';
    className?: string;
}

export default function GridItem({
    component: Component,
    id,
    category,
    isHero = false,
    selectedCategory,
    className,
    ...props
}: Readonly<GridItemProps> & React.HTMLAttributes<HTMLDivElement>) {
    // Determine if this card should be visible based on filtering
    // When "contact" is selected, exclude the theme card
    const isVisible = selectedCategory === 'all' || 
                     (category === selectedCategory && !(selectedCategory === 'contact' && id === 'theme')) || 
                     (isHero && selectedCategory !== 'projects');
    
    return (
        <div 
            {...props}
            className={cn(
                'transition-all duration-500 ease-in-out',
                isVisible 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-50 scale-95', // Non-matching cards fade and shrink
                className
            )}
        >
            <Component />
        </div>
    );
}
