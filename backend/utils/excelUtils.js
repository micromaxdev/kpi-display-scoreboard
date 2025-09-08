// Excel utils
// Helper function to get cell border styling
function getCellBorder() {
    return {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };
}

// Helper function to apply cell styling
function applyCellStyling(cell, fillColor, textColor = 'FF000000', isBold = true) {
    cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: fillColor }
    };
    cell.font = { 
        bold: isBold, 
        color: { argb: textColor },
        size: isBold ? 12 : 11
    };
    cell.border = getCellBorder();
}

// Extract original keys from categorized items
function getOriginalKeys(categorizedItems) {
    if (!categorizedItems || categorizedItems.length === 0) {
        return [];
    }
    const firstItem = categorizedItems[0];
    return Object.keys(firstItem).filter(key => 
        key !== 'ragCategory' && key !== 'comparisonValue'
    );
}

// Create headers for Excel sheets
function createHeaders(originalKeys, analysisField) {
    return [
        ...originalKeys,
        'RAG_Category',
        `${analysisField}_ComparisonValue`,
    ];
}

// Create and populate info section of summary sheet
function createInfoSection(summarySheet, collectionName, analysisField, direction, thresholds) {
    const infoRows = [
        [`KPI Analysis Report - ${collectionName}`],
        [`Analysis Field: ${analysisField}`],
        [`Direction: ${direction.toUpperCase()}`],
        [`Green Threshold: ${thresholds.green}`],
        [`Amber Threshold: ${thresholds.amber}`],
        [`Generated: ${new Date().toISOString()}`],
        [] // empty row
    ];

    infoRows.forEach((rowData) => {
        const row = summarySheet.addRow(rowData);
        row.font = { bold: true, size: 12 };
        row.eachCell((cell) => {
            applyCellStyling(cell, 'FFE6E6E6', 'FF000000', true);
        });
    });
}

// Create summary statistics section
function createSummaryStatistics(summarySheet, categorizedItems, ragGroups) {
    const summaryRows = [
        { text: '=== SUMMARY STATISTICS ===', color: 'FFD9D9D9' },
        { text: `Total Items: ${categorizedItems.length}`, color: 'FFD9D9D9' },
        { text: `Red (Critical): ${ragGroups.red.length} items`, color: 'FFFF4444', textColor: 'FFFFFFFF' },
        { text: `Amber (Warning): ${ragGroups.amber.length} items`, color: 'FFFFB84D', textColor: 'FF000000' },
        { text: `Green (Good): ${ragGroups.green.length} items`, color: 'FF4CAF50', textColor: 'FFFFFFFF' },
    ];

    summaryRows.forEach(rowData => {
        const row = summarySheet.addRow([rowData.text]);
        row.font = { bold: true, color: { argb: rowData.textColor || 'FF000000' } };
        row.eachCell(cell => {
            applyCellStyling(cell, rowData.color, rowData.textColor || 'FF000000', true);
        });
    });
}

// Auto-fit columns in a worksheet
function autoFitColumns(sheet) {
    sheet.columns.forEach(column => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
            const columnLength = cell.value ? cell.value.toString().length : 10;
            if (columnLength > maxLength) {
                maxLength = columnLength;
            }
        });
        column.width = Math.min(maxLength + 2, 50);
    });
}

// Create header row for category sheets
function createHeaderRow(sheet, headers) {
    const headerRow = sheet.addRow(headers);
    headerRow.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' }
    };
    return headerRow;
}

// Create data rows for category sheets
function createDataRows(sheet, items, originalKeys, category) {
    items.forEach(item => {
        const rowData = [
            ...originalKeys.map(key => {
                const value = item[key];
                return value instanceof Date ? value.toISOString() : value;
            }),
            item.ragCategory.toUpperCase(),
            item.comparisonValue,
        ];

        const dataRow = sheet.addRow(rowData);
        dataRow.eachCell((cell) => {
            applyCellStyling(cell, category.color, category.textColor, false);
        });
    });
}

// Create individual category sheet
function createCategorySheet(workbook, category, items, headers, originalKeys) {
    const sheet = workbook.addWorksheet(category.name);

    if (items.length > 0) {
        createHeaderRow(sheet, headers);
        createDataRows(sheet, items, originalKeys, category);
        autoFitColumns(sheet);
    } else {
        sheet.addRow([`${category.name} - No items in this category`]);
    }
}

// Create all category sheets
function createCategorySheets(workbook, ragGroups, headers, originalKeys) {
    const categoryOrder = [
        { key: 'red', name: 'Critical Items', color: 'FFFF4444', textColor: 'FFFFFFFF' },
        { key: 'amber', name: 'Warning Items', color: 'FFFFB84D', textColor: 'FF000000' },
        { key: 'green', name: 'Good Items', color: 'FF4CAF50', textColor: 'FFFFFFFF' }
    ];

    categoryOrder.forEach(category => {
        const items = ragGroups[category.key];
        createCategorySheet(workbook, category, items, headers, originalKeys);
    });
}

// Helper function to get Excel color codes for RAG categories
function getRagExcelColor(ragCategory) {
    const colorMap = {
        'red': {
            background: 'FF2600',
            text: 'FFFFFFFF'
        },
        'amber': {
            background: 'FFF700',
            text: 'FF000000'
        },
        'green': {
            background: '00FF2F',
            text: 'FFFFFFFF'
        }
    };
    
    return colorMap[ragCategory.toLowerCase()] || {
        background: 'FFCCCCCC',
        text: 'FF000000'
    };
}
module.exports = {
    getCellBorder,
    applyCellStyling,
    getOriginalKeys,
    createHeaders,
    createInfoSection,
    createSummaryStatistics,
    autoFitColumns,
    createCategorySheets,
    createCategorySheet,
    createDataRows,
    createHeaderRow,
    getRagExcelColor
};