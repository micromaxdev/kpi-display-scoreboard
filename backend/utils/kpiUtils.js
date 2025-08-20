import ExcelJS from 'exceljs';
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


export async function createColorCodedExcel(categorizedItems, analysisField, collectionName, thresholds, direction) {
    const workbook = new ExcelJS.Workbook();

    // ===== Summary Sheet =====
    const summarySheet = workbook.addWorksheet('Summary');

    if (!categorizedItems || categorizedItems.length === 0) {
        summarySheet.addRow(['No data available']);
        return workbook;
    }

    // Get original keys
    const firstItem = categorizedItems[0];
    const originalKeys = Object.keys(firstItem).filter(key => 
        key !== 'ragCategory' && key !== 'comparisonValue'
    );

    // Headers for all sheets
    const headers = [
        ...originalKeys,
        'RAG_Category',
        `${analysisField}_ComparisonValue`,
    ];

    // Info Section
    // Add info rows
    const infoRows = [
        [`KPI Analysis Report - ${collectionName}`],
        [`Analysis Field: ${analysisField}`],
        [`Direction: ${direction.toUpperCase()}`],
        [`Green Threshold: ${thresholds.green}`],
        [`Amber Threshold: ${thresholds.amber}`],
        [`Generated: ${new Date().toISOString()}`],
        [] // empty row
    ];

    // Apply background color and bold font to info rows
    infoRows.forEach((rowData, index) => {
        const row = summarySheet.addRow(rowData);
        row.font = { bold: true, size: 12 };
        row.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE6E6E6' } // light grey background
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });
    });

    // Separate into RAG groups
    const ragGroups = {
        red: categorizedItems.filter(item => item.ragCategory === 'red'),
        amber: categorizedItems.filter(item => item.ragCategory === 'amber'),
        green: categorizedItems.filter(item => item.ragCategory === 'green')
    };
    // Summary statistics with background colors
    const summaryRows = [
        { text: '=== SUMMARY STATISTICS ===', color: 'FFD9D9D9' }, // light grey
        { text: `Total Items: ${categorizedItems.length}`, color: 'FFD9D9D9' },
        { text: `Red (Critical): ${ragGroups.red.length} items`, color: 'FFFF4444', textColor: 'FFFFFFFF' },
        { text: `Amber (Warning): ${ragGroups.amber.length} items`, color: 'FFFFB84D', textColor: 'FF000000' },
        { text: `Green (Good): ${ragGroups.green.length} items`, color: 'FF4CAF50', textColor: 'FFFFFFFF' },
    ];

    // Add rows with styling
    summaryRows.forEach(rowData => {
        const row = summarySheet.addRow([rowData.text]);
        row.font = { bold: true, color: { argb: rowData.textColor || 'FF000000' } };
        row.eachCell(cell => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: rowData.color }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });
    });

    // ===== Category Sheets =====
    const categoryOrder = [
        { key: 'red', name: 'Critical Items', color: 'FFFF4444', textColor: 'FFFFFFFF' },
        { key: 'amber', name: 'Warning Items', color: 'FFFFB84D', textColor: 'FF000000' },
        { key: 'green', name: 'Good Items', color: 'FF4CAF50', textColor: 'FFFFFFFF' }
    ];

    categoryOrder.forEach(category => {
        const items = ragGroups[category.key];
        const sheet = workbook.addWorksheet(category.name);

        if (items.length > 0) {
            // Add header row
            const headerRow = sheet.addRow(headers);
            headerRow.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
            headerRow.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF4472C4' }
            };

            // Add data rows
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

                // Apply category-specific color styling
                dataRow.eachCell((cell) => {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: category.color }
                    };
                    cell.font = { color: { argb: category.textColor } };
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                });
            });

            // Auto-fit columns
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
        } else {
            sheet.addRow([`${category.name} - No items in this category`]);
        }
    });

    return workbook;
}



// Helper function to get Excel color codes for RAG categories
export function getRagExcelColor(ragCategory) {
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