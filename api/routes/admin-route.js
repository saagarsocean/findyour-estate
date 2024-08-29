import express from 'express';
import { verifyListing, getUnverifiedListings } from '../controllers/admin-controller.js';
import { adminMiddleware } from '../utils/adminMiddleware.js';
import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router();

// Verify a listing (admin only)
router.patch('/verify/:listingId', verifyToken, adminMiddleware, verifyListing);
router.get('/unverified', verifyToken, adminMiddleware, getUnverifiedListings)

export default router;