const express = require('express')
const { createScreen, getScreenByName, deleteScreen, getAllScreens,updateScreen } = require('../controllers/screenController.js')
const router = express.Router()

router.post('/', createScreen)
router.get('/:screenName', getScreenByName)
router.get('/', getAllScreens)
router.put('/:screenName', updateScreen)
router.delete('/:screenName', deleteScreen)

module.exports = router