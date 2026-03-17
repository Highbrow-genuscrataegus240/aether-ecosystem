"use client";
import React from 'react';
import dynamic from 'next/dynamic';

const SupplyDashboard = dynamic(
    () => import('../../supply/SupplyApp').then((mod) => {
        const { ThemeProvider } = require('../../supply/contexts/ThemeContext');
        const SupplyApp = mod.default;
        return {
            default: () => (
                <ThemeProvider>
                    <SupplyApp />
                </ThemeProvider>
            ),
        };
    }),
    { ssr: false }
);

export default function SupplyPage() {
    return <SupplyDashboard />;
}
