"use client";
import React, { useEffect } from "react";
import { X, Package, MapPin, DollarSign, User, AlertTriangle } from "lucide-react";
import { InventoryItem } from "./InventoryTable";

interface DetailViewProps {
  item: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DetailView: React.FC<DetailViewProps> = ({ item, isOpen, onClose }) => {
  // Comprehensive pin hiding with Shadow DOM support
  useEffect(() => {
    if (isOpen) {
      // Lock body scroll
      document.body.style.overflow = "hidden";

      // Hide all Velt pins including Shadow DOM elements
      const hideVeltPins = () => {
        // Standard DOM pins
        document.querySelectorAll(".velt-comment-pin").forEach(pin => {
          (pin as HTMLElement).style.display = "none";
        });

        // Shadow DOM pins (if accessible)
        document.querySelectorAll("*").forEach(element => {
          if (element.shadowRoot) {
            element.shadowRoot.querySelectorAll(".velt-comment-pin").forEach(pin => {
              (pin as HTMLElement).style.display = "none";
            });
          }
        });

        // Apply global CSS override for maximum coverage
        const style = document.createElement('style');
        style.id = 'velt-pin-override';
        style.textContent = `
          .velt-comment-pin,
          .velt-comment-pin::before,
          .velt-comment-pin::after {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
          }
        `;
        document.head.appendChild(style);
      };

      hideVeltPins();

      // Reapply hiding after a brief delay to catch dynamically loaded pins
      const timeoutId = setTimeout(hideVeltPins, 100);

      return () => {
        clearTimeout(timeoutId);
        document.body.style.overflow = "";

        // Restore pins
        document.querySelectorAll(".velt-comment-pin").forEach(pin => {
          (pin as HTMLElement).style.display = "";
        });

        document.querySelectorAll("*").forEach(element => {
          if (element.shadowRoot) {
            element.shadowRoot.querySelectorAll(".velt-comment-pin").forEach(pin => {
              (pin as HTMLElement).style.display = "";
            });
          }
        });

        // Remove global override
        const overrideStyle = document.getElementById('velt-pin-override');
        if (overrideStyle) {
          overrideStyle.remove();
        }
      };
    }
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "IN STOCK":
        return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900";
      case "LOW STOCK":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900";
      case "OUT OF STOCK":
        return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700";
    }
  };

  const stockPercentage = (item.CurrentStock / item.MaxStock) * 100;
  const isLowStock = item.CurrentStock <= item.MinStock;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" style={{ zIndex: 999999 }}>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-w-4xl w-full max-h-[85vh] flex flex-col" style={{ zIndex: 1000000 }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <Package className="text-gray-700 dark:text-gray-300" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {item.ProductName}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">SKU: {item.SKU}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {/* Item Details */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Package size={18} className="text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Stock Status
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Current Status</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.Status)}`}>
                    {item.Status}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Stock Level</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {item.CurrentStock} / {item.MaxStock}
                    </span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${isLowStock
                          ? 'bg-red-500'
                          : stockPercentage > 70
                            ? 'bg-green-500'
                            : 'bg-yellow-500'
                          }`}
                        style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                      />
                    </div>
                    <div className="absolute -top-1 right-0 text-xs text-gray-500 dark:text-gray-400">
                      {Math.round(stockPercentage)}%
                    </div>
                  </div>
                </div>

                {isLowStock && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800/30">
                    <AlertTriangle size={16} className="text-red-600 dark:text-red-400" />
                    <span className="text-sm text-red-700 dark:text-red-300">
                      Stock is below minimum threshold ({item.MinStock})
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Item Information */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Package size={18} className="text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Item Information
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <Package size={16} className="text-gray-500 dark:text-gray-400" />
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Category</span>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{item.Category}</p>
                  </div>
                </div>

                {item.Supplier && (
                  <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <User size={16} className="text-gray-500 dark:text-gray-400" />
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Supplier</span>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{item.Supplier}</p>
                    </div>
                  </div>
                )}

                {item.Location && (
                  <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <MapPin size={16} className="text-gray-500 dark:text-gray-400" />
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Location</span>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{item.Location}</p>
                    </div>
                  </div>
                )}

                {item.UnitPrice && (
                  <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <DollarSign size={16} className="text-gray-500 dark:text-gray-400" />
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Unit Price</span>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        ${item.UnitPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stock Thresholds */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={18} className="text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Stock Thresholds
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800/30">
                  <p className="text-2xl font-bold text-red-700 dark:text-red-300 mb-1">
                    {item.MinStock}
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium">Minimum</p>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/30">
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-1">
                    {item.CurrentStock}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Current</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/30">
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300 mb-1">
                    {item.MaxStock}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium">Maximum</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {item.LastUpdated}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
            >
              Close
            </button>
            <button className="px-6 py-2.5 bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-semibold rounded-lg transition-colors shadow-sm">
              Edit Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
