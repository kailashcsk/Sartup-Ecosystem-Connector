'use client';

import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import { SunIcon, MoonIcon } from 'lucide-react';

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
            {theme === 'dark' ? (
                <SunIcon className="h-5 w-5" />
            ) : (
                <MoonIcon className="h-5 w-5" />
            )}
        </Button>
    );
};

export default ThemeToggle;
