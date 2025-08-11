import express from 'express';
import {getPaginatedData,getCollectionsList,getFieldsOfCollection} from '../controllers/dynamicModelController.js'
const router = express.Router();


router.get('/find/:collectionName', getPaginatedData) 
router.get('/collectionList', getCollectionsList)
router.get('/collectionFields/:collectionName', getFieldsOfCollection)

export default router