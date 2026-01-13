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
    // Determine if this card should be highlighted (visible) or dimmed
    const isHighlighted = () => {
        if (selectedCategory === 'all') return true;
        if (selectedCategory === 'about') return ['description', 'location', 'resume', 'design-process', 'github-card', 'email', 'ai-portfolio'].includes(id);
        if (selectedCategory === 'projects') return ['project', 'project2', 'project3', 'project4', 'theme'].includes(id);
        if (selectedCategory === 'contact') return ['description', 'ai-portfolio', 'github-card', 'email', 'theme'].includes(id);
        return false;
    };

    const highlighted = isHighlighted();
    
    return (
        <div 
            {...props}
            className={cn(
                'transition-all duration-500 ease-in-out',
                highlighted 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-75 scale-95', // Dimmed but visible
                className
            )}
        >
            <Component />
        </div>
    );
}
