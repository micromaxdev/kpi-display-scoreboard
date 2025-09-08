const ExcelJS = require('exceljs');
const path = require('path');
const { isLikelyDate, parseToDateObject, formatDateToDDMMYY } = require('./dateUtils');

/**
 * Parse any file type (CSV, XLSX, XLS) using ExcelJS
 */
async function parseFile(filePath, fileExtension) {
    const workbook = new ExcelJS.Workbook();
    
    if (fileExtension === '.csv') {
        await workbook.csv.readFile(filePath);
    } else {
        await workbook.xlsx.readFile(filePath);
    }

    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
        throw new Error('No worksheet found in the file');
    }

    const data = [];
    const headers = [];
    let isFirstRow = true;

    worksheet.eachRow((row) => {
        const rowData = {};
        const rowValues = row.values.slice(1);

        if (isFirstRow) {
            headers.push(...rowValues.map(header => 
                header ? String(header).trim() : `Column_${headers.length + 1}`
            ));
            isFirstRow = false;
        } else {
            headers.forEach((header, index) => {
                let value = rowValues[index];
                
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
            
            if (Object.values(rowData).some(val => val !== null && val !== '')) {
                data.push(rowData);
            }
        }
    });

    return { data, headers };
}

/**
 * Basic data cleaning
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
            if (excludeFields.includes(key)) return;

            let cleanedValue = value;

            if (cleanedValue === undefined || cleanedValue === null) {
                cleanedRow[key] = null;
                return;
            }

            if (trimStrings && typeof cleanedValue === 'string') {
                cleanedValue = cleanedValue.trim();
                if (cleanedValue === '') cleanedValue = null;
            }

            if (formatDatesAsStrings && cleanedValue) {
                const isDateField = key.toLowerCase().includes('date');
                const looksLikeDate = typeof cleanedValue === 'string' && isLikelyDate(cleanedValue);
                
                if (isDateField || looksLikeDate) {
                    const dateObj = parseToDateObject(cleanedValue);
                    if (dateObj) {
                        cleanedValue = formatDateToDDMMYY(dateObj);
                    }
                }
            }

            if (convertNumbers && typeof cleanedValue === 'string' && cleanedValue !== null) {
                if (!cleanedValue.match(/^\d{2}\/\d{2}\/\d{2}$/)) {
                    const numValue = parseFloat(cleanedValue);
                    if (!isNaN(numValue) && isFinite(numValue) && cleanedValue.match(/^-?\d*\.?\d+$/)) {
                        cleanedValue = numValue;
                    }
                }
            }

            cleanedRow[key] = cleanedValue;
        });

        if (removeEmptyRows) {
            const hasData = Object.values(cleanedRow).some(val => val !== null && val !== '' && val !== undefined);
            return hasData ? cleanedRow : null;
        }

        return cleanedRow;
    }).filter(row => row !== null);
}

/**
 * Process file and return cleaned data
 */
async function processFileData(file, options = {}) {
    const { cleaningOptions = {}, addMetadata = true } = options;
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    const { data, headers } = await parseFile(file.path, fileExtension);

    if (!data || data.length === 0) {
        throw new Error('No data found in the file');
    }

    const cleanedData = cleanData(data, cleaningOptions);

    if (cleanedData.length === 0) {
        throw new Error('No valid data found after cleaning');
    }

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
async function previewFileData(file, options = {}) {
    const { maxPreviewRows = 10, cleaningOptions = {} } = options;
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    const { data, headers } = await parseFile(file.path, fileExtension);

    if (!data || data.length === 0) {
        throw new Error('No data found in the file');
    }

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

module.exports = {
    parseFile,
    cleanData,
    processFileData,
    previewFileData
};
