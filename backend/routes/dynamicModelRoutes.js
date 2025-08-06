import express from 'express';
const router = express.Router();
import {getCollectionData,getCollectionsList} from '../controllers/dynamicModelController.js'

router.get('/find/:collectionName', getCollectionData)
router.get('/list', getCollectionsList)
export default router