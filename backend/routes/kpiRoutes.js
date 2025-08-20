import express from 'express';
import { analyzeKPIData, downloadExcel } from '../controllers/kpiController.js';
const router = express.Router();

router.post('/analyze', analyzeKPIData);
router.post('/download-excel', downloadExcel);

export default router;