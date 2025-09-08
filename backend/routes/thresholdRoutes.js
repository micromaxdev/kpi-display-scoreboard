import express from 'express';
import { 
    getThresholdsByCollection, 
    getThreshold, 
    setThreshold,
    getThresholdById,
    getThresholdExcludedFields,
    getAllThresholds
} from '../controllers/thresholdController.js';

const router = express.Router();
router.get('/all', getAllThresholds); // /api/thresholds/all
router.get('/', getThresholdsByCollection); // /api/thresholds?collectionName=...
router.get('/single', getThreshold);        // /api/thresholds/single?collectionName=...&field=...
router.post('/', setThreshold);             // POST /api/thresholds

// Move specific routes BEFORE parameterized routes
router.get('/excluded-fields', getThresholdExcludedFields); // /api/thresholds/excluded-fields?collectionName=...&field=...

// Parameterized routes should come last
router.get('/:id', getThresholdById); // GET /api/thresholds/:id

export default router;