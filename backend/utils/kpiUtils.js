const ExcelJS = require('exceljs');
const {
    getOriginalKeys,
    createHeaders,
    createInfoSection,
    createSummaryStatistics,
    createCategorySheets,
    getRagExcelColor
} = require('./excelUtils');

async function validateInput(field, greenThreshold, amberThreshold) {
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

async function checkThresholds(greenThreshold, amberThreshold, direction) {
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

function sortCategoryItems(items, category, direction, field = '') {
    const isDateField = field.toLowerCase().includes('date') ||
                       field.toLowerCase().includes('due') ||
                       field.toLowerCase().includes('input') ||
                       field.toLowerCase().includes('created');
    
    if (category === 'red' || category === 'amber') {
        if (direction === 'lower') {
            return isDateField
                ? items.sort((a, b) => a.comparisonValue - b.comparisonValue) // ASC
                : items.sort((a, b) => b.comparisonValue - a.comparisonValue); // DESC
        } else {
            return isDateField
                ? items.sort((a, b) => b.comparisonValue - a.comparisonValue) // DESC
                : items.sort((a, b) => a.comparisonValue - b.comparisonValue); // ASC
        }
    } else if (category === 'green') {
        if (direction === 'lower') {
            return isDateField
                ? items.sort((a, b) => b.comparisonValue - a.comparisonValue) // DESC
                : items.sort((a, b) => a.comparisonValue - b.comparisonValue); // ASC
        } else {
            return isDateField
                ? items.sort((a, b) => a.comparisonValue - b.comparisonValue) // ASC
                : items.sort((a, b) => b.comparisonValue - a.comparisonValue); // DESC
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

/**
 * Filters out excluded fields from data objects
 */
function filterExcludedFields(items, excludedFields = []) {
    if (!Array.isArray(excludedFields) || excludedFields.length === 0) {
        return items;
    }
    
    return items.map(item => {
        const filteredItem = {};
        Object.keys(item).forEach(key => {
            if (!excludedFields.includes(key)) {
                filteredItem[key] = item[key];
            }
        });
        return filteredItem;
    });
}

async function createColorCodedExcel(categorizedItems, analysisField, collectionName, thresholds, direction) {
    const workbook = new ExcelJS.Workbook();
    const summarySheet = workbook.addWorksheet('Summary');

    if (!categorizedItems || categorizedItems.length === 0) {
        summarySheet.addRow(['No data available']);
        return workbook;
    }

    const originalKeys = getOriginalKeys(categorizedItems);
    const headers = createHeaders(originalKeys, analysisField);

    createInfoSection(summarySheet, collectionName, analysisField, direction, thresholds);
    const ragGroups = organizeRagGroups(categorizedItems, direction, analysisField);
    createSummaryStatistics(summarySheet, categorizedItems, ragGroups);
    createCategorySheets(workbook, ragGroups, headers, originalKeys);

    return workbook;
}

module.exports = {
    validateInput,
    checkThresholds,
    sortCategoryItems,
    filterExcludedFields,
    createColorCodedExcel
};
