"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterDropdownsProps {
    selectedMetric: string;
    selectedCategory: string;
    onMetricChange: (metric: string) => void;
    onCategoryChange: (category: string) => void;
}

export const FilterDropdowns: React.FC<FilterDropdownsProps> = ({
    selectedMetric,
    selectedCategory,
    onMetricChange,
    onCategoryChange
}) => {
    const [isMetricOpen, setIsMetricOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    const metricOptions = [
        'Stock quantity',
        'Stock value',
        'Low stock items',
        'Out of stock items',
        'Reorder alerts'
    ];

    const categoryOptions = [
        'All Categories',
        'Electronics',
        'Clothing',
        'Home & Garden',
        'Food & Beverages',
        'Sports & Fitness'
    ];

    return (
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            {/* Left Side - Filter Dropdowns */}
            <div className="flex items-center gap-6">
                {/* Metric Dropdown */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        METRIC: INVENTORY
                    </label>
                    <div className="relative">
                        <button
                            onClick={() => setIsMetricOpen(!isMetricOpen)}
                            className="flex items-center justify-between gap-2 px-3 py-2 min-w-[200px] text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                        >
                            <span>{selectedMetric}</span>
                            <ChevronDown size={16} className={`transition-transform ${isMetricOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isMetricOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50">
                                {metricOptions.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => {
                                            onMetricChange(option);
                                            setIsMetricOpen(false);
                                        }}
                                        className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors first:rounded-t-md last:rounded-b-md"
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Category Dropdown */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        PRODUCT GROUP (LEVEL 1): CATEGORY
                    </label>
                    <div className="relative">
                        <button
                            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                            className="flex items-center justify-between gap-2 px-3 py-2 min-w-[200px] text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                        >
                            <span>{selectedCategory}</span>
                            <ChevronDown size={16} className={`transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isCategoryOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50">
                                {categoryOptions.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => {
                                            onCategoryChange(option);
                                            setIsCategoryOpen(false);
                                        }}
                                        className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors first:rounded-t-md last:rounded-b-md"
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Side - Statistics Cards */}
            <div className="flex items-center gap-4">
                {/* Items in Stock Card */}
                <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#eff6ff" />
                            <polyline points="3.27,6.96 12,12.01 20.73,6.96" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <line x1="12" y1="22.08" x2="12" y2="12" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div>
                        <div className="text-xl font-bold text-gray-900 dark:text-gray-100">1,247</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Items in Stock</div>
                    </div>
                </div>

                {/* Low Stock Alert Card */}
                <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-center justify-center w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#fef2f2" />
                            <line x1="12" y1="9" x2="12" y2="13" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="12" cy="17" r="1" fill="#ef4444" />
                        </svg>
                    </div>
                    <div>
                        <div className="text-xl font-bold text-gray-900 dark:text-gray-100">23</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Low Stock Alert</div>
                    </div>
                </div>
            </div>
        </div>
    );
};