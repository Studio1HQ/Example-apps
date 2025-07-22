/**
 * Data Transformation Utilities
 * 
 * This file contains utilities to transform inventory data to delivery context
 * and handle data conversion between different formats.
 */

import {
    DeliveryShipment,
    ShipmentRecord,
    InventoryRecord,
    DeliveryStatus,
    Priority,
    ProductInfo,
    ShipmentQuantities,
    DeliveryInfo,
    TrackingInfo,
    CustomerInfo
} from '../types/delivery';

// ============================================================================
// STATUS MAPPING
// ============================================================================

/**
 * Maps inventory status to delivery status
 */
export const mapInventoryStatusToDeliveryStatus = (inventoryStatus: string): DeliveryStatus => {
    switch (inventoryStatus.toUpperCase()) {
        case 'IN STOCK':
            return DeliveryStatus.ON_TIME;
        case 'LOW STOCK':
            return DeliveryStatus.DELAYED;
        case 'OUT OF STOCK':
            return DeliveryStatus.FULFILLMENT_ISSUE;
        default:
            return DeliveryStatus.ON_TIME;
    }
};

/**
 * Maps delivery status back to inventory status for backward compatibility
 */
export const mapDeliveryStatusToInventoryStatus = (deliveryStatus: DeliveryStatus): string => {
    switch (deliveryStatus) {
        case DeliveryStatus.ON_TIME:
        case DeliveryStatus.IN_TRANSIT:
        case DeliveryStatus.DELIVERED:
            return 'IN STOCK';
        case DeliveryStatus.DELAYED:
            return 'LOW STOCK';
        case DeliveryStatus.FULFILLMENT_ISSUE:
            return 'OUT OF STOCK';
        default:
            return 'IN STOCK';
    }
};

// ============================================================================
// DATA TRANSFORMATION FUNCTIONS
// ============================================================================

/**
 * Transforms inventory record to shipment record
 */
export const transformInventoryToShipment = (
    inventoryRecord: InventoryRecord,
    shipmentId?: string,
    additionalData?: Partial<ShipmentRecord>
): ShipmentRecord => {
    const deliveryStatus = mapInventoryStatusToDeliveryStatus(inventoryRecord.Status);
    const currentDate = new Date();
    const etaDate = new Date(currentDate.getTime() + (3 * 24 * 60 * 60 * 1000)); // 3 days from now

    return {
        ShipmentID: shipmentId || `SHP-${Date.now()}`,
        DeliveryStatus: deliveryStatus,
        OriginalETA: etaDate.toISOString().split('T')[0],
        CurrentETA: etaDate.toISOString().split('T')[0],
        Priority: Priority.MEDIUM,

        // Recontextualized fields
        ProductName: inventoryRecord.ProductName,
        SKU: inventoryRecord.SKU,
        Category: inventoryRecord.Category,
        ShippedQuantity: Math.floor(inventoryRecord.CurrentStock * 0.2), // 20% of current stock
        AvailableStock: inventoryRecord.CurrentStock,
        TotalOrdered: inventoryRecord.MaxStock,
        LastUpdated: inventoryRecord.LastUpdated,

        // Apply additional data if provided
        ...additionalData
    };
};

/**
 * Transforms shipment record back to inventory record for backward compatibility
 */
export const transformShipmentToInventory = (shipmentRecord: ShipmentRecord): InventoryRecord => {
    return {
        ProductName: shipmentRecord.ProductName,
        SKU: shipmentRecord.SKU,
        Category: shipmentRecord.Category,
        CurrentStock: shipmentRecord.AvailableStock,
        MinStock: shipmentRecord.ShippedQuantity,
        MaxStock: shipmentRecord.TotalOrdered,
        Status: mapDeliveryStatusToInventoryStatus(shipmentRecord.DeliveryStatus),
        LastUpdated: shipmentRecord.LastUpdated
    };
};

/**
 * Transforms flat shipment record to structured delivery shipment
 */
export const transformRecordToDeliveryShipment = (record: ShipmentRecord): DeliveryShipment => {
    const productInfo: ProductInfo = {
        name: record.ProductName,
        sku: record.SKU,
        category: record.Category
    };

    const quantities: ShipmentQuantities = {
        shipped: record.ShippedQuantity,
        available: record.AvailableStock,
        totalOrdered: record.TotalOrdered
    };

    const delivery: DeliveryInfo = {
        status: record.DeliveryStatus,
        originalETA: new Date(record.OriginalETA),
        currentETA: new Date(record.CurrentETA),
        delayReason: record.DelayReason,
        fulfillmentIssues: record.FulfillmentIssues ? [record.FulfillmentIssues] : undefined
    };

    const tracking: TrackingInfo = {
        number: record.TrackingNumber,
        lastUpdated: new Date(),
        updates: []
    };

    const customer: CustomerInfo = {
        info: record.CustomerInfo,
        address: record.ShippingAddress
    };

    return {
        shipmentId: record.ShipmentID,
        productInfo,
        quantities,
        delivery,
        priority: record.Priority,
        tracking,
        customer
    };
};

/**
 * Transforms structured delivery shipment to flat record
 */
export const transformDeliveryShipmentToRecord = (shipment: DeliveryShipment): ShipmentRecord => {
    return {
        ShipmentID: shipment.shipmentId,
        DeliveryStatus: shipment.delivery.status,
        OriginalETA: shipment.delivery.originalETA.toISOString().split('T')[0],
        CurrentETA: shipment.delivery.currentETA.toISOString().split('T')[0],
        DelayReason: shipment.delivery.delayReason,
        FulfillmentIssues: shipment.delivery.fulfillmentIssues?.join(', '),
        Priority: shipment.priority,

        ProductName: shipment.productInfo.name,
        SKU: shipment.productInfo.sku,
        Category: shipment.productInfo.category,
        ShippedQuantity: shipment.quantities.shipped,
        AvailableStock: shipment.quantities.available,
        TotalOrdered: shipment.quantities.totalOrdered,
        LastUpdated: shipment.tracking.lastUpdated.toISOString(),

        CustomerInfo: shipment.customer.info,
        ShippingAddress: shipment.customer.address,
        TrackingNumber: shipment.tracking.number,
        EstimatedDeliveryWindow: `${shipment.delivery.originalETA.toISOString()} - ${shipment.delivery.currentETA.toISOString()}`
    };
};

// ============================================================================
// BATCH TRANSFORMATION FUNCTIONS
// ============================================================================

/**
 * Transforms array of inventory records to shipment records
 */
export const transformInventoryArrayToShipments = (
    inventoryRecords: InventoryRecord[],
    shipmentIdPrefix = 'SHP'
): ShipmentRecord[] => {
    return inventoryRecords.map((record, index) =>
        transformInventoryToShipment(
            record,
            `${shipmentIdPrefix}-${String(index + 1).padStart(3, '0')}`
        )
    );
};

/**
 * Transforms array of shipment records to inventory records
 */
export const transformShipmentArrayToInventory = (
    shipmentRecords: ShipmentRecord[]
): InventoryRecord[] => {
    return shipmentRecords.map(transformShipmentToInventory);
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generates a unique shipment ID
 */
export const generateShipmentId = (prefix = 'SHP') => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}-${timestamp}-${random}`;
};

/**
 * Calculates delay duration in days
 */
export const calculateDelayDuration = (originalETA: Date, currentETA: Date): number => {
    const timeDiff = currentETA.getTime() - originalETA.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
};

/**
 * Determines if a shipment is delayed
 */
export const isShipmentDelayed = (originalETA: Date, currentETA: Date): boolean => {
    return currentETA.getTime() > originalETA.getTime();
};

/**
 * Gets priority level based on delay duration and other factors
 */
export const calculatePriority = (
    delayDuration: number,
    fulfillmentIssues?: string[]
): Priority => {
    if (fulfillmentIssues && fulfillmentIssues.length > 0) {
        return Priority.HIGH;
    }

    if (delayDuration > 7) {
        return Priority.HIGH;
    } else if (delayDuration > 3) {
        return Priority.MEDIUM;
    }

    return Priority.LOW;
};