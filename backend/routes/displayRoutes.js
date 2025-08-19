import express from 'express';
import { setDisplay, getDisplayByName, addThresholdId, deleteThresholdId, deleteDisplay } from '../controllers/displayController.js';
const router = express.Router();

router.post('/', setDisplay);
router.get('/:displayName', getDisplayByName);
router.post('/:displayName/thresholds', addThresholdId);
router.delete('/:displayName/thresholds', deleteThresholdId);
router.delete('/:displayName', deleteDisplay);

export default router;
