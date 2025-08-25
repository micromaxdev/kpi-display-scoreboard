import ExcelJS from 'exceljs';
import {
    getOriginalKeys,
    createHeaders,
    createInfoSection,
    createSummaryStatistics,
    createCategorySheets,
    getRagExcelColor
} from './excelUtils.js';
export async function validateInput(field, greenThreshold, amberThreshold) {
    if (!field) {
        return { success: false, message: 'Field is required' };
    }
        
    if (greenThreshold === undefined || greenThreshold === null) {
        return { success: false, message: 'Green threshold is required' };
    }

    if (amberThreshold === undefined || amberThreshold === null) {
        return { success: false, message: 'Amber threshold is required' };
    }

    if (isNaN(parseFloat(greenThreshold))) {
        return { success: false, message: 'Green threshold must be a valid number' };
    }

    if (isNaN(parseFloat(amberThreshold))) {
        return { success: false, message: 'Amber threshold must be a valid number' };
    }
        
    return { success: true };
}

export async function checkThresholds(greenThreshold, amberThreshold, direction) {
    const green = parseFloat(greenThreshold);
    const amber = parseFloat(amberThreshold);
     if (direction === 'higher') {
            if (green <= amber) {
                return {
                    success: false,
                    message: 'For HIGHER direction, green threshold must be greater than amber threshold'
                };
            }
    } else if (direction === 'lower') {
        if (green >= amber) {
            return {
                success: false,
                message: 'For LOWER direction, green threshold must be less than amber threshold'
            };
        }
    } else {
        return {
            success: false,
            message: 'Direction must be either HIGHER or LOWER'
        };
    }
    return { success: true };
}
export function sortCategoryItems(items, category, direction, field = '') {
    const isDateField = field.toLowerCase().includes('date') ||
                       field.toLowerCase().includes('due') ||
                       field.toLowerCase().includes('input') ||
                       field.toLowerCase().includes('created');
    
    if (category === 'red' || category === 'amber') {
        // RED & AMBER: Show worst performers first (most critical)
        if (direction === 'lower') {
            if (isDateField) {
                // For due dates: Show most overdue first (least negative = most concerning)
                return items.sort((a, b) => a.comparisonValue - b.comparisonValue); // ASCENDING
            } else {
                // For amounts: Show highest values first (highest cost = worst)
                return items.sort((a, b) => b.comparisonValue - a.comparisonValue); // DESCENDING
            }
        } else {
            // For "higher" direction
            if (isDateField) {
                // For creation dates: Most recent first (least negative = most concerning)
                return items.sort((a, b) => b.comparisonValue - a.comparisonValue); // DESCENDING
            } else {
                // For amounts: Lowest values first (lowest revenue = worst)
                return items.sort((a, b) => a.comparisonValue - b.comparisonValue); // ASCENDING
            }
        }
    } else if (category === 'green') {
        // GREEN: Show best performers first
        if (direction === 'lower') {
            if (isDateField) {
                // For dates: Show future dates first, then least overdue
                return items.sort((a, b) => b.comparisonValue - a.comparisonValue); // DESCENDING
            } else {
                // For amounts: Show lowest values first (lowest cost = best)
                return items.sort((a, b) => a.comparisonValue - b.comparisonValue); // ASCENDING
            }
        } else {
            if (isDateField) {
                // For creation dates: Show oldest customers first (most negative = oldest)
                return items.sort((a, b) => a.comparisonValue - b.comparisonValue); // ASCENDING
            } else {
                // For amounts: Show highest values first (highest revenue = best)
                return items.sort((a, b) => b.comparisonValue - a.comparisonValue); // DESCENDING
            }
        }
    }
    return items;
}


// Organize items into RAG groups and sort them
function organizeRagGroups(categorizedItems, direction, analysisField) {
    return {
        red: sortCategoryItems(
            categorizedItems.filter(item => item.ragCategory === 'red'),
            'red',
            direction,
            analysisField
        ),
        amber: sortCategoryItems(
            categorizedItems.filter(item => item.ragCategory === 'amber'),
            'amber',
            direction,
            analysisField
        ),
        green: sortCategoryItems(
            categorizedItems.filter(item => item.ragCategory === 'green'),
            'green',
            direction,
            analysisField
        )
    };
}

// Main function - refactored and modularized
export async function createColorCodedExcel(categorizedItems, analysisField, collectionName, thresholds, direction) {
    const workbook = new ExcelJS.Workbook();
    const summarySheet = workbook.addWorksheet('Summary');

    // Early return for empty data
    if (!categorizedItems || categorizedItems.length === 0) {
        summarySheet.addRow(['No data available']);
        return workbook;
    }

    // Extract data structure information
    const originalKeys = getOriginalKeys(categorizedItems);
    const headers = createHeaders(originalKeys, analysisField);

    // Create summary sheet sections
    createInfoSection(summarySheet, collectionName, analysisField, direction, thresholds);
    
    // Organize and sort data by RAG categories
    const ragGroups = organizeRagGroups(categorizedItems, direction, analysisField);
    
    // Add summary statistics
    createSummaryStatistics(summarySheet, categorizedItems, ragGroups);

    // Create individual category sheets
    createCategorySheets(workbook, ragGroups, headers, originalKeys);

    return workbook;
}