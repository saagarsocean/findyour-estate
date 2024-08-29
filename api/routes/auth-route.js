import express from "express";
import { checkSchema } from "express-validator";
import userLoginValidationSchema from "../validations/user-login-validation-schema.js";
import userRegisterValidationSchema from "../validations/user-register-validation-schema.js";
import { google, signin, signup, signOut, verifyOTP, forgotPassword, resetPassword } from "../controllers/auth-controller.js";

const router = express.Router()

router.post('/signup', checkSchema(userRegisterValidationSchema), signup)
router.post('/verify-otp', verifyOTP)
router.post('/signin',checkSchema(userLoginValidationSchema), signin)
router.post('/google', google)
router.get('/signout', signOut)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

export default router