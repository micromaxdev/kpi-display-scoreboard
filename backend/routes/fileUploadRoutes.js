const express = require('express');
const { uploadSingleFile, handleUploadError } = require('../middleware/uploadMiddleware.js');
const { uploadFileToCollection, previewFile } = require('../controllers/fileUploadController.js');

const router = express.Router();

// File upload routes with middleware chain
router.post(
    '/:collectionName/upload',
    uploadSingleFile,
    handleUploadError,
    uploadFileToCollection
);

router.post(
    '/preview',
    uploadSingleFile,
    handleUploadError,
    previewFile
);

module.exports = router;