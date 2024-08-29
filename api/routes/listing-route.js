import express from "express";
import { createListing, deleteListing, updateListing, getListing, getListings } from "../controllers/listing-controller.js";
import { verifyToken } from "../utils/verifyToken.js";
import { checkSchema } from "express-validator";
import listingValidationSchema from "../validations/listing-validation-schema.js";

const router = express.Router()

router.post('/create',verifyToken, checkSchema(listingValidationSchema), createListing)
router.delete('/delete/:id', verifyToken, deleteListing)
router.post('/update/:id', verifyToken, checkSchema(listingValidationSchema), updateListing)
router.get('/get/:id', getListing)
router.get('/get', getListings)

export default router