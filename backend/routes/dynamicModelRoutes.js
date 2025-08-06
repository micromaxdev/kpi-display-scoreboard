import express from 'express';
const router = express.Router();
import {getCollectionData} from '../controllers/dynamicModelController.js'

router.get('/:collectionName', getCollectionData)

export default router