const express = require('express');
const {getPaginatedData,getCollectionsList,getFieldsOfCollection} = require('../controllers/dynamicModelController.js')
const router = express.Router();


router.get('/find/:collectionName', getPaginatedData) 
router.get('/collectionList', getCollectionsList)
router.get('/collectionFields/:collectionName', getFieldsOfCollection)

module.exports = router