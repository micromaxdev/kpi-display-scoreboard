import express from 'express';
import { analyzeKPIData } from '../controllers/kpiController.js';
const router = express.Router();

router.post('/analyze', analyzeKPIData);

export default router;