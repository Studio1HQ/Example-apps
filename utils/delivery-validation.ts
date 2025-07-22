/**
 * Delivery Data Validation Utilities
 * 
 * This file contains validation functions for delivery-specific fields
 * and data integrity checks.
 */

import {
    DeliveryShipment,
    ShipmentRecord,
    DeliveryStatus,
    Priority,
    ValidationResult,
    ValidationRules,
    DeliveryValidationSchema
} from '../types/delivery';

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

/**
 * Validation schema for shipment record fields
 */
export const SHIPMENT_VALIDATION_SCHEMA: DeliveryValidationSchema = {
    ShipmentID: {
        required: true,
        minLength: 3,
        maxLength: 50,
        pattern: /^[A-Z]{3}-\d{3,}$/
    },
    ProductName: {
        required: true,
        minLength: 1,
        maxLength: 200
    },
    SKU: {
        required: true,
        minLength: 3,
        maxLength: 50,
        pattern: /^[A-Z]{3}-\d{3}$/
    },
    Category: {
        required: true,
        minLength: 1,
        maxLength: 100
    },
    ShippedQuantity: {
        required: true,
        customValidator: (value: number) => value >= 0
    },
    AvailableStock: {
        required: true,
        customValidator: (value: number) => value >= 0
    },
    TotalOrdered: {
        required: true,
        customValidator: (value: number) => value > 0
    },
    DeliveryStatus: {
        required: true,
        customValidator: (value: string) => Object.values(DeliveryStatus).includes(value as DeliveryStatus)
    },
    Priority: {
        required: true,
        customValidator: (value: string) => Object.values(Priority).includes(value as Priority)
    },
    OriginalETA: {
        required: true,
        pattern: /^\d{4}-\d{2}-\d{2}$/
    },
    CurrentETA: {
        required: true,
        pattern: /^\d{4}-\d{2}-\d{2}$/
    },
    DelayReason: {
        required: false,
        maxLength: 500
    },
    FulfillmentIssues: {
        required: false,
        maxLength: 1000
    },
    CustomerInfo: {
        required: false,
        maxLength: 200
    },
    ShippingAddress: {
        required: false,
        maxLength: 500
    },
    TrackingNumber: {
        required: false,
        pattern: /^[A-Za-z0-9-]{10,30}$/
    }
};

// ============================================================================
// FIELD VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validates a single field value against its rules
 */
export const validateField = (
    fieldName: string,
    value: any,
    rules: ValidationRules
): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required field validation
    if (rules.required && (value === null || value === undefined || value === '')) {
        errors.push(`${fieldName} is required`);
        return { isValid: false, errors, warnings };
    }

    // Skip other validations if field is not required and empty
    if (!rules.required && (value === null || value === undefined || value === '')) {
        return { isValid: true, errors, warnings };
    }

    // String length validations
    if (typeof value === 'string') {
        if (rules.minLength && value.length < rules.minLength) {
            errors.push(`${fieldName} must be at least ${rules.minLength} characters long`);
        }

        if (rules.maxLength && value.length > rules.maxLength) {
            errors.push(`${fieldName} must not exceed ${rules.maxLength} characters`);
        }

        // Pattern validation
        if (rules.pattern && !rules.pattern.test(value)) {
            errors.push(`${fieldName} format is invalid`);
        }
    }

    // Custom validation
    if (rules.customValidator && !rules.customValidator(value)) {
        errors.push(`${fieldName} failed custom validation`);
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
};

/**
 * Validates shipment ID format
 */
export const validateShipmentId = (shipmentId: string): ValidationResult => {
    return validateField('ShipmentID', shipmentId, SHIPMENT_VALIDATION_SCHEMA.ShipmentID);
};

/**
 * Validates delivery status
 */
export const validateDeliveryStatus = (status: string): ValidationResult => {
    return validateField('DeliveryStatus', status, SHIPMENT_VALIDATION_SCHEMA.DeliveryStatus);
};

/**
 * Validates priority level
 */
export const validatePriority = (priority: string): ValidationResult => {
    return validateField('Priority', priority, SHIPMENT_VALIDATION_SCHEMA.Priority);
};

/**
 * Validates ETA date format and logic
 */
export const validateETA = (originalETA: string, currentETA: string): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate date formats
    const originalResult = validateField('OriginalETA', originalETA, SHIPMENT_VALIDATION_SCHEMA.OriginalETA);
    const currentResult = validateField('CurrentETA', currentETA, SHIPMENT_VALIDATION_SCHEMA.CurrentETA);

    errors.push(...originalResult.errors, ...currentResult.errors);

    if (errors.length === 0) {
        const originalDate = new Date(originalETA);
        const currentDate = new Date(currentETA);
        const today = new Date();

        // Check if dates are valid
        if (isNaN(originalDate.getTime())) {
            errors.push('Original ETA is not a valid date');
        }

        if (isNaN(currentDate.getTime())) {
            errors.push('Current ETA is not a valid date');
        }

        if (errors.length === 0) {
            // Check if original ETA is in the past (warning only)
            if (originalDate < today) {
                warnings.push('Original ETA is in the past');
            }

            // Check if current ETA is delayed
            if (currentDate > originalDate) {
                warnings.push('Shipment is delayed from original ETA');
            }

            // Check if current ETA is too far in the future (warning)
            const maxFutureDate = new Date();
            maxFutureDate.setMonth(maxFutureDate.getMonth() + 6);
            if (currentDate > maxFutureDate) {
                warnings.push('Current ETA is more than 6 months in the future');
            }
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
};

/**
 * Validates quantity relationships
 */
export const validateQuantities = (
    shippedQuantity: number,
    availableStock: number,
    totalOrdered: number
): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic quantity validations
    if (shippedQuantity < 0) {
        errors.push('Shipped quantity cannot be negative');
    }

    if (availableStock < 0) {
        errors.push('Available stock cannot be negative');
    }

    if (totalOrdered <= 0) {
        errors.push('Total ordered must be greater than zero');
    }

    if (errors.length === 0) {
        // Logical validations
        if (shippedQuantity > totalOrdered) {
            errors.push('Shipped quantity cannot exceed total ordered');
        }

        if (shippedQuantity > availableStock) {
            warnings.push('Shipped quantity exceeds available stock - may indicate backorder');
        }

        if (availableStock > totalOrdered) {
            warnings.push('Available stock exceeds total ordered - may indicate overstock');
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
};

// ============================================================================
// RECORD VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validates a complete shipment record
 */
export const validateShipmentRecord = (record: ShipmentRecord): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate each field according to schema
    Object.entries(SHIPMENT_VALIDATION_SCHEMA).forEach(([fieldName, rules]) => {
        const fieldValue = (record as any)[fieldName];
        const result = validateField(fieldName, fieldValue, rules);

        errors.push(...result.errors);
        warnings.push(...result.warnings);
    });

    // Cross-field validations
    if (record.OriginalETA && record.CurrentETA) {
        const etaResult = validateETA(record.OriginalETA, record.CurrentETA);
        errors.push(...etaResult.errors);
        warnings.push(...etaResult.warnings);
    }

    if (record.ShippedQuantity !== undefined &&
        record.AvailableStock !== undefined &&
        record.TotalOrdered !== undefined) {
        const quantityResult = validateQuantities(
            record.ShippedQuantity,
            record.AvailableStock,
            record.TotalOrdered
        );
        errors.push(...quantityResult.errors);
        warnings.push(...quantityResult.warnings);
    }

    // Business logic validations
    if (record.DeliveryStatus === DeliveryStatus.DELAYED && !record.DelayReason) {
        warnings.push('Delayed shipments should have a delay reason specified');
    }

    if (record.DeliveryStatus === DeliveryStatus.FULFILLMENT_ISSUE && !record.FulfillmentIssues) {
        warnings.push('Fulfillment issues should be documented');
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
};

/**
 * Validates a delivery shipment object
 */
export const validateDeliveryShipment = (shipment: DeliveryShipment): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate shipment ID
    const shipmentIdResult = validateShipmentId(shipment.shipmentId);
    errors.push(...shipmentIdResult.errors);
    warnings.push(...shipmentIdResult.warnings);

    // Validate product info
    if (!shipment.productInfo.name) {
        errors.push('Product name is required');
    }
    if (!shipment.productInfo.sku) {
        errors.push('Product SKU is required');
    }
    if (!shipment.productInfo.category) {
        errors.push('Product category is required');
    }

    // Validate quantities
    const quantityResult = validateQuantities(
        shipment.quantities.shipped,
        shipment.quantities.available,
        shipment.quantities.totalOrdered
    );
    errors.push(...quantityResult.errors);
    warnings.push(...quantityResult.warnings);

    // Validate delivery info
    const statusResult = validateDeliveryStatus(shipment.delivery.status);
    errors.push(...statusResult.errors);

    const etaResult = validateETA(
        shipment.delivery.originalETA.toISOString().split('T')[0],
        shipment.delivery.currentETA.toISOString().split('T')[0]
    );
    errors.push(...etaResult.errors);
    warnings.push(...etaResult.warnings);

    // Validate priority
    const priorityResult = validatePriority(shipment.priority);
    errors.push(...priorityResult.errors);

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
};

/**
 * Validates an array of shipment records
 */
export const validateShipmentRecords = (records: ShipmentRecord[]): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const shipmentIds = new Set<string>();

    records.forEach((record, index) => {
        // Validate individual record
        const recordResult = validateShipmentRecord(record);

        // Add index to error messages for clarity
        recordResult.errors.forEach(error => {
            errors.push(`Record ${index + 1}: ${error}`);
        });

        recordResult.warnings.forEach(warning => {
            warnings.push(`Record ${index + 1}: ${warning}`);
        });

        // Check for duplicate shipment IDs
        if (shipmentIds.has(record.ShipmentID)) {
            errors.push(`Record ${index + 1}: Duplicate shipment ID ${record.ShipmentID}`);
        } else {
            shipmentIds.add(record.ShipmentID);
        }
    });

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
};

// ============================================================================
// UTILITY VALIDATION FUNCTIONS
// ============================================================================

/**
 * Checks if a value is a valid date string
 */
export const isValidDateString = (dateString: string): boolean => {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && !!dateString.match(/^\d{4}-\d{2}-\d{2}$/);
};

/**
 * Checks if a tracking number format is valid
 */
export const isValidTrackingNumber = (trackingNumber: string): boolean => {
    return /^[A-Za-z0-9-]{10,30}$/.test(trackingNumber);
};

/**
 * Sanitizes and validates text input
 */
export const sanitizeTextInput = (input: string, maxLength = 500): string => {
    return input.trim().substring(0, maxLength);
};