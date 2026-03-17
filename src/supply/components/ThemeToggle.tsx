// @ts-nocheck
"use client";
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative w-14 h-7 bg-slate-300 dark:bg-muted rounded-full p-1 transition-colors hover:bg-slate-400 dark:hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-primary/50"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            <div
                className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-foreground flex items-center justify-center transition-transform duration-300 ${theme === 'light' ? 'translate-x-7' : 'translate-x-0'
                    }`}
            >
                {theme === 'dark' ? (
                    <Moon className="w-3 h-3 text-background" />
                ) : (
                    <Sun className="w-3 h-3 text-background" />
                )}
            </div>
        </button>
    );
};
