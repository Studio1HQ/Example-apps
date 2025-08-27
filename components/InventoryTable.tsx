"use client";

import React, { useMemo, useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    flexRender,
    createColumnHelper,
    SortingState,
} from '@tanstack/react-table';
import { VeltCommentTool, VeltPresence } from '@veltdev/react';
import { ChevronUp, ChevronDown, Eye } from 'lucide-react';
import { DetailView } from './DetailView';
import { useDarkMode } from '@/app/layout';

export interface InventoryItem {
    id: string;
    ProductName: string;
    SKU: string;
    Category: string;
    CurrentStock: number;
    MinStock: number;
    MaxStock: number;
    Status: 'IN STOCK' | 'LOW STOCK' | 'OUT OF STOCK';
    LastUpdated: string;
    Supplier?: string;
    Location?: string;
    UnitPrice?: number;
}

interface InventoryTableProps {
    data: InventoryItem[];
    selectedMetric?: string;
    selectedCategory?: string;
}

const columnHelper = createColumnHelper<InventoryItem>();



export const InventoryTable: React.FC<InventoryTableProps> = ({ data, selectedMetric, selectedCategory }) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
    const { isDarkMode } = useDarkMode();

    const handleViewDetails = (item: InventoryItem) => {
        setSelectedItem(item);
        setIsDetailViewOpen(true);
    };

    const handleCloseDetailView = () => {
        setIsDetailViewOpen(false);
        setSelectedItem(null);
    };

    const columns = useMemo(
        () => [
            columnHelper.accessor('ProductName', {
                header: 'Product Name',
                cell: ({ getValue }) => (
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                        {getValue()}
                    </span>
                ),
            }),
            columnHelper.accessor('SKU', {
                header: 'SKU',
                size: 150,
                cell: ({ getValue }) => (
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                        {getValue()}
                    </span>
                ),
            }),
            columnHelper.accessor('Category', {
                header: 'Category',
                cell: ({ getValue }) => (
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        {getValue()}
                    </span>
                ),
            }),
            columnHelper.accessor('CurrentStock', {
                header: 'Current Stock',
                cell: ({ getValue, row }) => {
                    const value = getValue();
                    const isLow = value <= row.original.MinStock;
                    return (
                        <span className={`text-sm font-medium ${isLow ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`}>
                            {value.toLocaleString()}
                        </span>
                    );
                },
            }),
            columnHelper.accessor('Status', {
                header: 'Status',
                cell: ({ getValue }) => {
                    const status = getValue();
                    const getStatusStyle = (status: string) => {
                        switch (status) {
                            case "IN STOCK":
                                return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
                            case "LOW STOCK":
                                return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
                            case "OUT OF STOCK":
                                return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
                            default:
                                return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
                        }
                    };

                    return (
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusStyle(status)}`}>
                            {status}
                        </span>
                    );
                },
            }),
            columnHelper.accessor('LastUpdated', {
                header: 'Last Updated',
                cell: ({ getValue }) => (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {getValue()}
                    </span>
                ),
            }),
            columnHelper.display({
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => (
                    <button
                        onClick={() => handleViewDetails(row.original)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                    >
                        <Eye size={16} />
                        View
                    </button>
                ),
            }),

        ],
        []
    );

    // Apply dropdown filters
    const filteredData = useMemo(() => {
        let filtered = data;

        // Apply category filter
        if (selectedCategory && selectedCategory !== 'All Categories') {
            filtered = filtered.filter(item => item.Category === selectedCategory);
        }

        // Apply metric filter
        if (selectedMetric) {
            switch (selectedMetric) {
                case 'Low stock items':
                    filtered = filtered.filter(item => item.CurrentStock <= item.MinStock);
                    break;
                case 'Out of stock items':
                    filtered = filtered.filter(item => item.CurrentStock === 0);
                    break;
                case 'Reorder alerts':
                    filtered = filtered.filter(item => item.CurrentStock <= item.MinStock);
                    break;
                case 'Stock value':
                    // Sort by stock value (CurrentStock * UnitPrice)
                    filtered = filtered.sort((a, b) => {
                        const valueA = a.CurrentStock * (a.UnitPrice || 0);
                        const valueB = b.CurrentStock * (b.UnitPrice || 0);
                        return valueB - valueA;
                    });
                    break;
                case 'Stock quantity':
                default:
                    // Default view - no additional filtering
                    break;
            }
        }

        return filtered;
    }, [data, selectedMetric, selectedCategory]);
    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
            globalFilter,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getRowId: (row) => row.id, // Use stable ID from your data
    });

    return (
        <div className="w-full">
            {/* Search */}
            <div className="mb-4">
                <input
                    value={globalFilter ?? ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search inventory..."
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-gray-300 dark:border-gray-600 rounded-lg">
                <table className="min-w-full border-collapse">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-r border-gray-300 dark:border-gray-600"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <div className="flex items-center gap-2">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getIsSorted() && (
                                                <span>
                                                    {header.column.getIsSorted() === 'desc' ? (
                                                        <ChevronDown size={14} />
                                                    ) : (
                                                        <ChevronUp size={14} />
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900">
                        {table.getRowModel().rows.map((row) => (
                            <tr
                                key={row.id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-300 dark:border-gray-600"
                            >
                                {row.getVisibleCells().map((cell, cellIndex) => {
                                    const cellId = `cell-${row.index}-${cellIndex}`;
                                    return (
                                        <td
                                            key={cell.id}
                                            id={cellId}
                                            data-velt-target-comment-element-id={cellId}
                                            className="relative px-6 py-4 whitespace-nowrap text-sm border-r border-gray-300 dark:border-gray-600 group"
                                            onMouseEnter={(e) => {
                                                const commentTool = e.currentTarget.querySelector('.velt-comment-tool');
                                                if (commentTool) {
                                                    (commentTool as HTMLElement).style.opacity = '1';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                const commentTool = e.currentTarget.querySelector('.velt-comment-tool');
                                                if (commentTool) {
                                                    (commentTool as HTMLElement).style.opacity = '0';
                                                }
                                            }}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            {/* Velt Comment Tool - positioned in top-right corner */}
                                            <div className="velt-comment-tool absolute top-1 right-1 opacity-0 transition-opacity duration-200 z-10">
                                                <VeltCommentTool
                                                    targetElementId={cellId}
                                                    style={{ width: "16px", height: "16px" }}
                                                    darkMode={isDarkMode}
                                                />
                                                <VeltPresence />
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Detail View Modal */}
            {selectedItem && (
                <DetailView
                    item={selectedItem}
                    isOpen={isDetailViewOpen}
                    onClose={handleCloseDetailView}
                />
            )}
        </div>
    );
};
