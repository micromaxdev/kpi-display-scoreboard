const express = require('express');
const { analyzeKPIData, downloadExcel } = require('../controllers/kpiController.js');
const router = express.Router();

router.post('/analyze', analyzeKPIData);
router.post('/download-excel', downloadExcel);

module.exports = router;