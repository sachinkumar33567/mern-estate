import express from 'express'
import {delteteUser, getListings, getUser, test, updateUser} from '../controllers/user.controller.js'
import { varifyToken } from '../utils/varifyUser.js'

const router = express.Router()

router.get('/test', test)
router.post('/update/:id', varifyToken, updateUser)
router.delete('/delete/:id', varifyToken, delteteUser)
router.get('/listings/:id', varifyToken, getListings)
router.get('/:id', varifyToken, getUser)

export default router