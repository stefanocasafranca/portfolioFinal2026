'use client';

import { useMounted } from '@/utils/hooks';
import { cn } from '@/utils/lib';
import { useUIMode } from '@/contexts/ui-mode';
import Card from '../../ui/card';

export default function Theme() {
    const { isAiMode } = useUIMode();
    
    // In normal mode, this is the homepage card that enters AI mode
    // In AI mode, this component is not rendered (AI mode has its own exit toggle)
    if (isAiMode) {
        return null;
    }
    
    // Render normal homepage toggle card
    return (
        <Card className="relative flex h-full flex-col items-center justify-center gap-4 p-6">
            <ThemeToggle />
            <div className="flex flex-col items-center gap-2">
                <h2 className="font-sf-pro text-xl md:text-2xl font-semibold text-black text-center">
                    Ask me anything
                </h2>
                <p className="font-sf-pro text-xs md:text-sm text-gray-500 text-center">
                    AI Portfolio
                </p>
            </div>
        </Card>
    );
}

function ThemeToggle() {
    const isMounted = useMounted();
    const { isAiMode, enterAiMode, isActivating } = useUIMode();

    const handleToggle = () => {
        // In normal mode, this enters AI mode
        if (isMounted && !isActivating) {
            enterAiMode();
        }
    };

    if (!isMounted) return null;

    const isOn = isAiMode || isActivating;

    return (
        <button
            className={cn(
                'cancel-drag relative h-[31px] w-[51px] cursor-pointer rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2',
                isOn ? 'bg-[#34C759]' : 'bg-[#E9E9EB]'
            )}
            onClick={handleToggle}
            disabled={isActivating}
            aria-label={isActivating ? 'Activating AI Portfolio...' : isOn ? 'Exit AI Portfolio mode' : 'Enter AI Portfolio mode'}
            aria-pressed={isOn}
        >
            <span
                className={cn(
                    'absolute top-[2px] left-[2px] h-[27px] w-[27px] rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out',
                    isOn && 'translate-x-[20px]',
                    isActivating && 'animate-pulse'
                )}
            />
        </button>
    );
}
