import express from 'express'
import { createScreen, getScreenByName, deleteScreen, getAllScreens,updateScreen } from '../controllers/screenController.js'
const router = express.Router()

router.post('/', createScreen)
router.get('/:screenName', getScreenByName)
router.get('/', getAllScreens)
router.put('/:screenName', updateScreen)
router.delete('/:screenName', deleteScreen)

export default router