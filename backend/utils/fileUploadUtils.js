import ExcelJS from 'exceljs';
import path from 'path';
import { isLikelyDate, parseToDateObject, formatDateToDDMMYY } from './dateUtils.js';

/**
 * Parse any file type (CSV, XLSX, XLS) using ExcelJS
 */
async function parseFile(filePath, fileExtension) {
    const workbook = new ExcelJS.Workbook();
    
    // Use appropriate ExcelJS method based on file type
    if (fileExtension === '.csv') {
        await workbook.csv.readFile(filePath);
    } else {
        await workbook.xlsx.readFile(filePath);
    }

    // Get the first worksheet
    const worksheet = workbook.getWorksheet(1);
    
    if (!worksheet) {
        throw new Error('No worksheet found in the file');
    }

    const data = [];
    const headers = [];
    let isFirstRow = true;

    worksheet.eachRow((row, rowNumber) => {
        const rowData = {};
        const rowValues = row.values.slice(1); // Remove the first empty element

        if (isFirstRow) {
            // First row contains headers
            headers.push(...rowValues.map(header => 
                header ? String(header).trim() : `Column_${headers.length + 1}`
            ));
            isFirstRow = false;
        } else {
            // Map values to headers
            headers.forEach((header, index) => {
                let value = rowValues[index];
                
                // Handle different data types
                if (value instanceof Date) {
                    rowData[header] = value;
                } else if (typeof value === 'number') {
                    rowData[header] = value;
                } else if (value !== undefined && value !== null) {
                    rowData[header] = String(value).trim();
                } else {
                    rowData[header] = null;
                }
            });
            
            // Only add row if it has some data
            if (Object.values(rowData).some(val => val !== null && val !== '')) {
                data.push(rowData);
            }
        }
    });

    return { data, headers };
}

/**
 * Basic data cleaning (minimal processing)
 */
function cleanData(data, options = {}) {
    const {
        removeEmptyRows = true,
        trimStrings = true,
        convertNumbers = true,
        formatDatesAsStrings = false,
        excludeFields = []
    } = options;

    return data.map(row => {
        const cleanedRow = {};
        
        Object.entries(row).forEach(([key, value]) => {
            // Skip excluded fields
            if (excludeFields.includes(key)) {
                return;
            }

            let cleanedValue = value;

            // Skip if value is undefined or null
            if (cleanedValue === undefined || cleanedValue === null) {
                cleanedRow[key] = null;
                return;
            }

            // Trim strings
            if (trimStrings && typeof cleanedValue === 'string') {
                cleanedValue = cleanedValue.trim();
                // Convert empty strings to null
                if (cleanedValue === '') {
                    cleanedValue = null;
                }
            }

            // Auto-detect and format dates when formatDatesAsStrings is enabled
            if (formatDatesAsStrings && cleanedValue) {
                // Check if it's a date field by field name (contains 'date')
                const isDateField = key.toLowerCase().includes('date');
                
                // Check if value looks like a date using dateUtils
                const looksLikeDate = typeof cleanedValue === 'string' && isLikelyDate(cleanedValue);
                
                if (isDateField || looksLikeDate) {
                    // Use dateUtils to parse and format the date
                    const dateObj = parseToDateObject(cleanedValue);
                    
                    if (dateObj) {
                        // Use dateUtils to format as dd/mm/yy
                        cleanedValue = formatDateToDDMMYY(dateObj);
                    }
                }
            }

            // Convert numbers (only if not already converted to date string)
            if (convertNumbers && typeof cleanedValue === 'string' && cleanedValue !== null) {
                // Don't convert if it's already a formatted date
                if (!cleanedValue.match(/^\d{2}\/\d{2}\/\d{2}$/)) {
                    const numValue = parseFloat(cleanedValue);
                    if (!isNaN(numValue) && isFinite(numValue) && cleanedValue.match(/^-?\d*\.?\d+$/)) {
                        cleanedValue = numValue;
                    }
                }
            }

            cleanedRow[key] = cleanedValue;
        });

        // Remove empty rows if specified
        if (removeEmptyRows) {
            const hasData = Object.values(cleanedRow).some(val => 
                val !== null && val !== '' && val !== undefined
            );
            return hasData ? cleanedRow : null;
        }

        return cleanedRow;
    }).filter(row => row !== null);
}

/**
 * Process file and return cleaned data (no validation)
 */
export async function processFileData(file, options = {}) {
    const {
        cleaningOptions = {},
        addMetadata = true
    } = options;

    // Get file extension from the already validated file
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    // Parse file using ExcelJS
    const { data, headers } = await parseFile(file.path, fileExtension);

    if (!data || data.length === 0) {
        throw new Error('No data found in the file');
    }

    // Clean data
    const cleanedData = cleanData(data, cleaningOptions);

    if (cleanedData.length === 0) {
        throw new Error('No valid data found after cleaning');
    }

    // Add metadata to each document if requested
    const processedData = addMetadata ? cleanedData.map(item => ({
        ...item,
        _uploadedAt: new Date(),
        _source: file.originalname
    })) : cleanedData;

    return {
        success: true,
        data: processedData,
        headers: headers,
        totalRecords: processedData.length,
        fileName: file.originalname,
        fileSize: file.size,
        fileType: fileExtension
    };
}

/**
 * Preview file data (no validation)
 */
export async function previewFileData(file, options = {}) {
    const { 
        maxPreviewRows = 10,
        cleaningOptions = {}
    } = options;

    // Get file extension from the already validated file
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    // Parse file using ExcelJS
    const { data, headers } = await parseFile(file.path, fileExtension);

    if (!data || data.length === 0) {
        throw new Error('No data found in the file');
    }

    // Clean preview data
    const cleanedData = cleanData(data.slice(0, maxPreviewRows), cleaningOptions);

    return {
        success: true,
        headers,
        preview: cleanedData,
        totalRows: data.length,
        fileName: file.originalname,
        fileSize: file.size,
        fileType: fileExtension
    };
}