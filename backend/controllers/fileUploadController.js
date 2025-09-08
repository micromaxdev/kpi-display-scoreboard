const { processFileData, previewFileData } = require('../utils/fileUploadUtils.js');
const { uploadDataToCollection } = require('../services/dataService.js');
const fs = require('fs');

/**
 * Get default cleaning options for file processing
 * @returns {Object} Default cleaning configuration
 */
function getDefaultCleaningOptions() {
    return {
        removeEmptyRows: true,
        trimStrings: true,
        convertNumbers: true,
        formatDatesAsStrings: true  // Format dates as dd/mm/yy strings using dateUtils
    };
}

/**
 * Upload file to specific collection (simplified)
 */
const uploadFileToCollection = async (req, res) => {
    try {
        const { collectionName } = req.params;
        const file = req.file;
        
        if (!file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Process file data with default cleaning options
        const processResult = await processFileData(file, {
            cleaningOptions: getDefaultCleaningOptions(),
            addMetadata: true
        });

        if (!processResult.success) {
            return res.status(400).json({
                success: false,
                message: 'Failed to process file',
                error: processResult.message
            });
        }

        // Upload to MongoDB using existing dataService
        const uploadResult = await uploadDataToCollection(collectionName, processResult.data);

        // Immediately cleanup the temporary file after successful processing
        if (file.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }

        // Return response following your established pattern
        res.json({
            success: uploadResult.success,
            data: {
                insertedCount: uploadResult.data.length,
                totalRecords: processResult.totalRecords,
                fileName: processResult.fileName,
                fileSize: processResult.fileSize,
                fileType: processResult.fileType,
                headers: processResult.headers,
                uploadedAt: new Date()
            },
            collectionName: uploadResult.collection
        });

    } catch (error) {
        console.error('Error uploading file to collection:', error);
        
        // Cleanup file even on error
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({
            success: false,
            message: 'Error uploading file',
            error: error.message
        });
    }
};

/**
 * Preview file data without uploading (simplified)
 */
const previewFile = async (req, res) => {
    try {
        const { maxRows = 10 } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Use same default cleaning options for preview
        const preview = await previewFileData(file, {
            maxPreviewRows: parseInt(maxRows),
            cleaningOptions: getDefaultCleaningOptions()
        });

        // Immediately cleanup the temporary file after preview
        if (file.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }

        res.json({
            success: preview.success,
            data: preview,
            message: 'File preview generated successfully'
        });

    } catch (error) {
        console.error('Error previewing file:', error);
        
        // Cleanup file even on error
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({
            success: false,
            message: 'Error previewing file',
            error: error.message
        });
    }
};

module.exports = {
    uploadFileToCollection,
    previewFile
};