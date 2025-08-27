import express from 'express';
import { getThresholdsByCollection, getThreshold, setThreshold,getThresholdById } from '../controllers/thresholdController.js';

const router = express.Router();

router.get('/', getThresholdsByCollection); // /api/thresholds?collectionName=...
router.get('/single', getThreshold);        // /api/thresholds/single?collectionName=...&field=...
router.post('/', setThreshold);             // POST /api/thresholds
router.get('/:id', getThresholdById); // GET /api/thresholds/:id
export default router;