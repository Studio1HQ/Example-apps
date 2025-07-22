"use client";

import { useSetDocument, VeltComments } from "@veltdev/react";
import React, { useState } from "react";
import { InventoryTable, InventoryItem } from "@/components/InventoryTable";
import { FilterDropdowns } from "@/components/FilterDropdowns";



const createInventoryData = (): InventoryItem[] => {
  return [
    {
      id: "1",
      ProductName: "Bluetooth Headphones",
      SKU: "WBH-001",
      Category: "Electronics",
      CurrentStock: 245,
      MinStock: 50,
      MaxStock: 500,
      Status: "IN STOCK",
      LastUpdated: "2 hrs ago",
      Supplier: "TechCorp Inc.",
      Location: "Warehouse A-1",
      UnitPrice: 79.99
    },
    {
      id: "2",
      ProductName: "Cotton T-Shirt",
      SKU: "OCT-015",
      Category: "Clothing",
      CurrentStock: 15,
      MinStock: 20,
      MaxStock: 200,
      Status: "LOW STOCK",
      LastUpdated: "1 hr ago",
      Supplier: "Fashion Plus",
      Location: "Warehouse B-2",
      UnitPrice: 24.99
    },
    {
      id: "3",
      ProductName: "Steel Water Bottle",
      SKU: "SWB-032",
      Category: "Home & Garden",
      CurrentStock: 0,
      MinStock: 25,
      MaxStock: 150,
      Status: "OUT OF STOCK",
      LastUpdated: "3 hrs ago",
      Supplier: "EcoLife Products",
      Location: "Warehouse C-3",
      UnitPrice: 19.99
    },
    {
      id: "4",
      ProductName: "Coffee Beans",
      SKU: "PCB-009",
      Category: "Food & Beverages",
      CurrentStock: 89,
      MinStock: 30,
      MaxStock: 300,
      Status: "IN STOCK",
      LastUpdated: "30 min ago",
      Supplier: "Premium Coffee Co.",
      Location: "Warehouse D-1",
      UnitPrice: 12.99
    },
    {
      id: "5",
      ProductName: "Wireless Mouse",
      SKU: "WMS-024",
      Category: "Electronics",
      CurrentStock: 156,
      MinStock: 40,
      MaxStock: 250,
      Status: "IN STOCK",
      LastUpdated: "1 hr ago",
      Supplier: "TechCorp Inc.",
      Location: "Warehouse A-2",
      UnitPrice: 29.99
    },
    {
      id: "6",
      ProductName: "Desk Lamp",
      SKU: "DLM-018",
      Category: "Home & Garden",
      CurrentStock: 8,
      MinStock: 15,
      MaxStock: 100,
      Status: "LOW STOCK",
      LastUpdated: "45 min ago",
      Supplier: "Home Essentials",
      Location: "Warehouse C-1",
      UnitPrice: 45.99
    },
    {
      id: "7",
      ProductName: "Gaming Keyboard",
      SKU: "GKB-055",
      Category: "Electronics",
      CurrentStock: 72,
      MinStock: 35,
      MaxStock: 180,
      Status: "IN STOCK",
      LastUpdated: "20 min ago",
      Supplier: "Gaming Gear Ltd.",
      Location: "Warehouse A-3",
      UnitPrice: 89.99
    },
    {
      id: "8",
      ProductName: "Yoga Mat",
      SKU: "YMT-041",
      Category: "Sports & Fitness",
      CurrentStock: 3,
      MinStock: 10,
      MaxStock: 80,
      Status: "LOW STOCK",
      LastUpdated: "4 hrs ago",
      Supplier: "FitLife Equipment",
      Location: "Warehouse E-1",
      UnitPrice: 34.99
    }
  ];
};

export default function Page() {
  const inventoryData = createInventoryData();
  const [selectedMetric, setSelectedMetric] = useState('Stock quantity');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  useSetDocument("inventory-dashboard-main", { documentName: "Inventory Dashboard Discussion" });

  return (
    <div className="h-full w-full flex flex-col bg-white dark:bg-gray-900 m-0 p-0">
      <VeltComments
        popoverMode={true}
        customAutocompleteSearch={true}

      />

      {/* Filter Dropdowns */}
      <FilterDropdowns
        selectedMetric={selectedMetric}
        selectedCategory={selectedCategory}
        onMetricChange={setSelectedMetric}
        onCategoryChange={setSelectedCategory}
      />

      {/* Header Row */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Inventory Stock Status</h1>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <InventoryTable
          data={inventoryData}
          selectedMetric={selectedMetric}
          selectedCategory={selectedCategory}
        />
      </div>
    </div>
  );
}

