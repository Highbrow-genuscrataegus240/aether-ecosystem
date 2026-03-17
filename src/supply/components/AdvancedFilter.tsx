// @ts-nocheck
"use client";
import React from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { StockStatus, DemandTrend, Supplier, Warehouse } from '../types';

export interface FilterState {
    category: string;
    status: string;
    trend: string;
    warehouseId: string;
    supplierId: string;
    priceMin: string;
    priceMax: string;
}

export const emptyFilters: FilterState = {
    category: '',
    status: '',
    trend: '',
    warehouseId: '',
    supplierId: '',
    priceMin: '',
    priceMax: ''
};

interface AdvancedFilterProps {
    filters: FilterState;
    onFiltersChange: (filters: FilterState) => void;
    categories: string[];
    suppliers: Supplier[];
    warehouses: Warehouse[];
    isOpen: boolean;
    onToggle: () => void;
    activeFilterCount: number;
}

export const AdvancedFilter: React.FC<AdvancedFilterProps> = ({
    filters,
    onFiltersChange,
    categories,
    suppliers,
    warehouses,
    isOpen,
    onToggle,
    activeFilterCount
}) => {
    const updateFilter = (key: keyof FilterState, value: string) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    const clearAll = () => {
        onFiltersChange(emptyFilters);
    };

    const removeFilter = (key: keyof FilterState) => {
        onFiltersChange({ ...filters, [key]: '' });
    };

    const activeFilters = (Object.entries(filters) as [keyof FilterState, string][]).filter(([_, v]) => v !== '');

    const getFilterLabel = (key: string, value: string): string => {
        switch (key) {
            case 'category': return `Category: ${value}`;
            case 'status': return `Status: ${value}`;
            case 'trend': return `Trend: ${value}`;
            case 'warehouseId': {
                const wh = warehouses.find(wh => wh.id === value);
                return `Warehouse: ${wh?.name || value}`;
            }
            case 'supplierId': {
                const sup = suppliers.find(sup => sup.id === value);
                return `Supplier: ${sup?.name || value}`;
            }
            case 'priceMin': return `Min Price: ₹${value}`;
            case 'priceMax': return `Max Price: ₹${value}`;
            default: return value;
        }
    };

    const selectClass = "w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";

    return (
        <div>
            {/* Active Filter Chips */}
            {activeFilters.length > 0 && (
                <div className="flex items-center flex-wrap gap-2 mb-3">
                    {activeFilters.map(([key, value]) => (
                        <span
                            key={key}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
                        >
                            {getFilterLabel(key, value as string)}
                            <button
                                onClick={() => removeFilter(key as keyof FilterState)}
                                className="hover:text-red-400 transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                    <button
                        onClick={clearAll}
                        className="text-xs text-muted-foreground hover:text-red-400 transition-colors px-2 py-1"
                    >
                        Clear all
                    </button>
                </div>
            )}

            {/* Filter Panel */}
            {isOpen && (
                <div className="rounded-xl border border-border bg-card p-4 mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal className="w-4 h-4 text-primary" />
                            <h3 className="text-sm font-semibold text-foreground">Advanced Filters</h3>
                        </div>
                        <button
                            onClick={clearAll}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Reset All
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {/* Category */}
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Category</label>
                            <select
                                value={filters.category}
                                onChange={(e) => updateFilter('category', e.target.value)}
                                className={selectClass}
                            >
                                <option value="">All Categories</option>
                                {categories.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        {/* Stock Status */}
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Stock Status</label>
                            <select
                                value={filters.status}
                                onChange={(e) => updateFilter('status', e.target.value)}
                                className={selectClass}
                            >
                                <option value="">All Statuses</option>
                                <option value={StockStatus.NORMAL}>Normal</option>
                                <option value={StockStatus.LOW}>Low Stock</option>
                                <option value={StockStatus.CRITICAL}>Critical</option>
                                <option value={StockStatus.OVERSTOCKED}>Overstocked</option>
                            </select>
                        </div>

                        {/* Demand Trend */}
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Demand Trend</label>
                            <select
                                value={filters.trend}
                                onChange={(e) => updateFilter('trend', e.target.value)}
                                className={selectClass}
                            >
                                <option value="">All Trends</option>
                                <option value={DemandTrend.INCREASING}>Increasing</option>
                                <option value={DemandTrend.STABLE}>Stable</option>
                                <option value={DemandTrend.DECLINING}>Declining</option>
                            </select>
                        </div>

                        {/* Warehouse */}
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Warehouse</label>
                            <select
                                value={filters.warehouseId}
                                onChange={(e) => updateFilter('warehouseId', e.target.value)}
                                className={selectClass}
                            >
                                <option value="">All Warehouses</option>
                                {warehouses.map(w => (
                                    <option key={w.id} value={w.id}>{w.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Supplier */}
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Supplier</label>
                            <select
                                value={filters.supplierId}
                                onChange={(e) => updateFilter('supplierId', e.target.value)}
                                className={selectClass}
                            >
                                <option value="">All Suppliers</option>
                                {suppliers.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Price Range */}
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Min Price (₹)</label>
                            <input
                                type="number"
                                value={filters.priceMin}
                                onChange={(e) => updateFilter('priceMin', e.target.value)}
                                className={selectClass}
                                placeholder="0"
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Max Price (₹)</label>
                            <input
                                type="number"
                                value={filters.priceMax}
                                onChange={(e) => updateFilter('priceMax', e.target.value)}
                                className={selectClass}
                                placeholder="∞"
                                min="0"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
