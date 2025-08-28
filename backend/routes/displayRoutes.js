import express from 'express';
import { setDisplay, getDisplayByName, addThresholdId, deleteThresholdId, deleteDisplay, saveOrUpdateDisplay,reorderThresholds } from '../controllers/displayController.js';
const router = express.Router();

router.post('/', setDisplay);
router.post('/save', saveOrUpdateDisplay);
router.get('/:displayName', getDisplayByName);
router.post('/:displayName/thresholds', addThresholdId);
router.put('/:displayName/thresholds/reorder', reorderThresholds);
router.delete('/:displayName/thresholds', deleteThresholdId);
router.delete('/:displayName', deleteDisplay);

export default router;
