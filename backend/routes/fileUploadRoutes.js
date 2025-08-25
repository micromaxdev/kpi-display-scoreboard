import express from 'express';
import { uploadSingleFile, handleUploadError } from '../middleware/uploadMiddleware.js';
import { uploadFileToCollection, previewFile } from '../controllers/fileUploadController.js';

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

export default router;