const express = require('express');
const { setDisplay, getDisplayByName, addThresholdId, deleteThresholdId, deleteDisplay, saveOrUpdateDisplay,reorderThresholds,getAllDisplays } = require('../controllers/displayController.js');
const router = express.Router();

router.post('/', setDisplay);
router.get('/', getAllDisplays);
router.post('/save', saveOrUpdateDisplay);
router.get('/:displayName', getDisplayByName);
router.post('/:displayName/thresholds', addThresholdId);
router.put('/:displayName/thresholds/reorder', reorderThresholds);
router.delete('/:displayName/thresholds', deleteThresholdId);
router.delete('/:displayName', deleteDisplay);

module.exports = router;
