const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const ensureUploadDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/temp/';
        ensureUploadDir(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
    }
});

// File filter function
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['.csv', '.xlsx', '.xls'];
    const allowedMimeTypes = [
        'text/csv',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
    ];
    
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype;
    
    if (allowedTypes.includes(fileExtension) && allowedMimeTypes.includes(mimeType)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type. Only ${allowedTypes.join(', ')} files are allowed.`), false);
    }
};

// Configure multer
const uploadConfig = {
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
        files: 1 // Only allow single file upload
    },
    fileFilter: fileFilter
};

// Create multer instance
const upload = multer(uploadConfig);

// Export different upload middleware variants
const uploadSingleFile = upload.single('file');

const uploadMultipleFiles = upload.array('files', 10); // Max 10 files

const uploadFileFields = upload.fields([
    { name: 'dataFile', maxCount: 1 },
    { name: 'schemaFile', maxCount: 1 }
]);

// Error handling middleware for multer errors
const handleUploadError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        switch (error.code) {
            case 'LIMIT_FILE_SIZE':
                return res.status(400).json({
                    success: false,
                    message: 'File too large. Maximum size is 50MB.',
                    error: 'FILE_TOO_LARGE'
                });
            case 'LIMIT_FILE_COUNT':
                return res.status(400).json({
                    success: false,
                    message: 'Too many files uploaded.',
                    error: 'TOO_MANY_FILES'
                });
            case 'LIMIT_UNEXPECTED_FILE':
                return res.status(400).json({
                    success: false,
                    message: 'Unexpected file field.',
                    error: 'UNEXPECTED_FILE'
                });
            default:
                return res.status(400).json({
                    success: false,
                    message: 'File upload error.',
                    error: error.code
                });
        }
    } else if (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
            error: 'UPLOAD_ERROR'
        });
    }
    next();
};

// Cleanup middleware to remove temporary files
const cleanupTempFiles = (req, res, next) => {
    // Add cleanup function to response object
    const originalSend = res.send;
    res.send = function(data) {
        // Cleanup temp files after response is sent
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error cleaning up temp file:', err);
            });
        }
        
        if (req.files) {
            const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
            files.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlink(file.path, (err) => {
                        if (err) console.error('Error cleaning up temp file:', err);
                    });
                }
            });
        }
        
        originalSend.call(this, data);
    };
    
    next();
};

// Export all functions
module.exports = {
    uploadSingleFile,
    uploadMultipleFiles,
    uploadFileFields,
    handleUploadError,
    cleanupTempFiles
};