import express from 'express';
import { varifyToken } from '../utils/varifyUser.js';
import {
    createListing,
    deleteListing,
    getListing,
    getListings,
    updateListing
} from '../controllers/listing.controller.js';

const router = express.Router();

router.post('/create', varifyToken, createListing);
router.delete('/delete/:id', varifyToken, deleteListing)
router.post('/update/:id', varifyToken, updateListing)
router.get('/get/:id', getListing)
router.get('/get', getListings)

export default router;