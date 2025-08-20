import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { ThemeProviderProps } from 'next-themes/dist/types';
import { UIModeProvider } from '@/contexts/ui-mode';

export function ThemeProvider({ children, ...props }: Readonly<ThemeProviderProps>) {
    return (
        <NextThemeProvider {...props} disableTransitionOnChange>
            <UIModeProvider>
                {children}
            </UIModeProvider>
        </NextThemeProvider>
    );
}
