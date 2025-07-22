/**
 * Delivery Shipment Data Model
 * 
 * This file defines the TypeScript interfaces and types for the delivery shipment
 * data model, including enums for delivery status and priority, as well as
 * transformation utilities and validation functions.
 */

// ============================================================================
// ENUMS
// ============================================================================

/**
 * Delivery status enum representing the current state of a shipment
 */
export enum DeliveryStatus {
    ON_TIME = 'On Time',
    DELAYED = 'Delayed',
    FULFILLMENT_ISSUE = 'Fulfillment Issue',
    DELIVERED = 'Delivered',
    IN_TRANSIT = 'In Transit'
}

/**
 * Priority levels for shipments
 */
export enum Priority {
    HIGH = 'High',
    MEDIUM = 'Medium',
    LOW = 'Low'
}

// ============================================================================
// CORE INTERFACES
// ============================================================================

/**
 * Product information interface
 */
export interface ProductInfo {
    name: string;
    sku: string;
    category: string;
}

/**
 * Quantity information for shipments
 */
export interface ShipmentQuantities {
    shipped: number;
    available: number;
    totalOrdered: number;
}

/**
 * Delivery tracking information
 */
export interface DeliveryInfo {
    status: DeliveryStatus;
    originalETA: Date;
    currentETA: Date;
    delayReason?: string;
    fulfillmentIssues?: string[];
}

/**
 * Tracking update entry
 */
export interface TrackingUpdate {
    timestamp: Date;
    status: string;
    location?: string;
    notes?: string;
}

/**
 * Tracking information
 */
export interface TrackingInfo {
    number?: string;
    lastUpdated: Date;
    updates: TrackingUpdate[];
}

/**
 * Customer information
 */
export interface CustomerInfo {
    info?: string;
    address?: string;
}

/**
 * Main delivery shipment interface
 */
export interface DeliveryShipment {
    shipmentId: string;
    productInfo: ProductInfo;
    quantities: ShipmentQuantities;
    delivery: DeliveryInfo;
    priority: Priority;
    tracking: TrackingInfo;
    customer: CustomerInfo;
}

/**
 * Flattened shipment record for table display
 * This matches the structure expected by AG-Grid
 */
export interface ShipmentRecord {
    // New delivery-specific fields
    ShipmentID: string;
    DeliveryStatus: DeliveryStatus;
    OriginalETA: string;
    CurrentETA: string;
    DelayReason?: string;
    FulfillmentIssues?: string;
    Priority: Priority;

    // Recontextualized existing fields
    ProductName: string;        // Item being shipped
    SKU: string;               // Product identifier
    Category: string;          // Product category for logistics grouping
    ShippedQuantity: number;   // Quantity in this shipment (was CurrentStock)
    AvailableStock: number;    // Remaining inventory (was MinStock)
    TotalOrdered: number;      // Total quantity ordered (was MaxStock)
    LastUpdated: string;       // Last status update

    // Additional context fields
    CustomerInfo?: string;
    ShippingAddress?: string;
    TrackingNumber?: string;
    EstimatedDeliveryWindow?: string;
}

/**
 * Original inventory record interface for backward compatibility
 */
export interface InventoryRecord {
    ProductName: string;
    SKU: string;
    Category: string;
    CurrentStock: number;
    MinStock: number;
    MaxStock: number;
    Status: string;
    LastUpdated: string;
}

// ============================================================================
// VALIDATION INTERFACES
// ============================================================================

/**
 * Validation result interface
 */
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

/**
 * Field validation rules
 */
export interface ValidationRules {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    customValidator?: (value: any) => boolean;
}

/**
 * Validation schema for delivery fields
 */
export interface DeliveryValidationSchema {
    [fieldName: string]: ValidationRules;
}