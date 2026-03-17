// @ts-nocheck
"use client";
import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

export interface DateRange {
    startDate: Date;
    endDate: Date;
    label: string;
}

interface DateRangePickerProps {
    value: DateRange;
    onChange: (range: DateRange) => void;
}

const getPresetRanges = (): DateRange[] => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // This week (Monday to Sunday)
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    // Last week
    const lastMonday = new Date(monday);
    lastMonday.setDate(monday.getDate() - 7);
    const lastSunday = new Date(monday);
    lastSunday.setDate(monday.getDate() - 1);

    // This month
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Last month
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // This quarter
    const quarter = Math.floor(now.getMonth() / 3);
    const thisQuarterStart = new Date(now.getFullYear(), quarter * 3, 1);
    const thisQuarterEnd = new Date(now.getFullYear(), (quarter + 1) * 3, 0);

    // Last 30 days
    const last30Start = new Date(today);
    last30Start.setDate(today.getDate() - 30);

    // Last 90 days
    const last90Start = new Date(today);
    last90Start.setDate(today.getDate() - 90);

    // All time (last year)
    const allTimeStart = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

    return [
        { label: 'Last 7 Days', startDate: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), endDate: today },
        { label: 'Last 30 Days', startDate: last30Start, endDate: today },
        { label: 'This Week', startDate: monday, endDate: today },
        { label: 'Last Week', startDate: lastMonday, endDate: lastSunday },
        { label: 'This Month', startDate: thisMonthStart, endDate: thisMonthEnd },
        { label: 'Last Month', startDate: lastMonthStart, endDate: lastMonthEnd },
        { label: 'This Quarter', startDate: thisQuarterStart, endDate: thisQuarterEnd },
        { label: 'Last 90 Days', startDate: last90Start, endDate: today },
        { label: 'All Time', startDate: allTimeStart, endDate: today },
    ];
};

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showCustom, setShowCustom] = useState(false);
    const [customStart, setCustomStart] = useState(value.startDate.toISOString().split('T')[0]);
    const [customEnd, setCustomEnd] = useState(value.endDate.toISOString().split('T')[0]);

    const presets = getPresetRanges();

    const handlePresetSelect = (range: DateRange) => {
        onChange(range);
        setIsOpen(false);
        setShowCustom(false);
    };

    const handleCustomApply = () => {
        onChange({
            label: 'Custom Range',
            startDate: new Date(customStart),
            endDate: new Date(customEnd)
        });
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted transition-colors text-sm"
            >
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground font-medium">{value.label}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-lg border border-border bg-card shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* Preset options */}
                    <div className="p-2 max-h-64 overflow-y-auto">
                        {presets.map((preset, index) => (
                            <button
                                key={index}
                                onClick={() => handlePresetSelect(preset)}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${value.label === preset.label
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-foreground hover:bg-muted'
                                    }`}
                            >
                                <span className="font-medium">{preset.label}</span>
                                <span className="text-xs text-muted-foreground ml-2">
                                    {preset.startDate.toLocaleDateString()} - {preset.endDate.toLocaleDateString()}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Custom range */}
                    <div className="border-t border-border p-3">
                        {!showCustom ? (
                            <button
                                onClick={() => setShowCustom(true)}
                                className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                + Custom Range
                            </button>
                        ) : (
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs text-muted-foreground">Start</label>
                                        <input
                                            type="date"
                                            value={customStart}
                                            onChange={(e) => setCustomStart(e.target.value)}
                                            className="w-full mt-1 px-2 py-1.5 bg-muted border border-border rounded text-sm text-foreground"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-muted-foreground">End</label>
                                        <input
                                            type="date"
                                            value={customEnd}
                                            onChange={(e) => setCustomEnd(e.target.value)}
                                            className="w-full mt-1 px-2 py-1.5 bg-muted border border-border rounded text-sm text-foreground"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleCustomApply}
                                    className="w-full py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                                >
                                    Apply
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// Default date range (last 30 days)
export const getDefaultDateRange = (): DateRange => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    return {
        label: 'Last 30 Days',
        startDate: thirtyDaysAgo,
        endDate: today
    };
};
