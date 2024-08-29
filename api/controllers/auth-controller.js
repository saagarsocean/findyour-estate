import User from "../models/user-model.js";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken'
import { validationResult } from "express-validator";
import { sendOTPEmail } from '../utils/mail.js'
import crypto from 'crypto'

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

export const signup = async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()})
    }

    const { username, email, password } = req.body  // Extracting from req.body

    if (password.length < 7) {
        return res.status(400).json({ message: 'Password must be at least 7 characters long' })
    }
    
    const hashedPassword = bcryptjs.hashSync(password, 10)
    const otp = generateOTP()
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000)
    
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        otp,
        otpExpires
    })
    
    try {
        await newUser.save()
        sendOTPEmail(email, otp, 'verification')
        res.status(201).json({ user: newUser, message: 'User created successfully! Please verify your email.' })
    } catch (err) {
        if (err.code === 11000) {
            if (err.keyPattern.username) {
                return res.status(400).json({ message: 'Username is already taken' })
            }
            if (err.keyPattern.email) {
                return res.status(400).json({ message: 'Email is already taken' })
            }
        }
        res.status(500).json({ error: 'Something went wrong' })
    }
}

export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body
  
    try {
        const user = await User.findOne({ email })
  
        if (!user) {
            return res.status(404).json({ message: 'User not found!' })
        }
  
        if (user.isVerified) {
            return res.status(400).json({ message: 'Email already verified!' })
        }
  
        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP!' })
        }
  
        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'OTP expired!' })
        }
  
        user.isVerified = true
        user.otp = null
        user.otpExpires = null
  
        await user.save()
  
        res.status(200).json({ message: 'Email verified successfully!' })
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong!' })
    }
}

export const signin = async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()})
    }

    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: 'Invalid email or password' })
        }

        const isAuth = await bcryptjs.compare(password, user.password)
        if (!isAuth) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        const adminExists = await User.findOne({ isAdmin: true })
        
        if (!adminExists) {
        user.isAdmin = true;
        await user.save();
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        const { password: pass, ...rest } = user._doc
        res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest)
    } catch (err) {
        console.error('Error during sign-in:', err)
        res.status(500).json({ error: 'Something went wrong!' })
    }
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' })
    }
    const otp = crypto.randomInt(100000, 999999).toString()
    const otpExpires = Date.now() + 10 * 60 * 1000
    user.otp = otp
    await user.save()
    sendOTPEmail(email, otp)
    res.json({ success: true })
}
  
export const resetPassword = async (req, res) => {
    const { otp, newPassword } = req.body
  
    try {
        const user = await User.findOne({ otp })
        if (!user) {
            return res.status(400).json({ error: 'Invalid OTP' })
        }
  
        const hashedPassword = bcryptjs.hashSync(newPassword, 10)
  
        user.password = hashedPassword
        user.otp = null
        user.otpExpires = null
        await user.save()
  
        res.status(200).json({ message: 'Password reset successfully' })
    } catch (error) {
        console.error('Error during password reset:', error)
        res.status(500).json({ error: 'Something went wrong!' })
    }
}

export const google = async (req, res) => {
    try{
        const user = await User.findOne({ email: req.body.email })
        if(user) {
            if (!user.isVerified) {
                user.isVerified = true;
                await user.save();
            }
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            const {password: pass, ...rest } = user._doc
            res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest)
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10)
            const newUser = new User({ 
                username: req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4), 
                email:req.body.email, 
                password: hashedPassword, 
                avatar: req.body.photo,
                isVerified: true
            })
            await newUser.save()
            const token = jwt.sign({ id: newUser._id}, process.env.JWT_SECRET)
            const {password:pass, ...rest} = newUser._doc
            res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest)
        }
    } catch(err) {
        res.status(500).json({ errors: 'Something went wrong!'})
    }
}

export const signOut = async(req, res) => {
    try{
        res.clearCookie('access_token')
        res.status(200).json('User has been logged out!')
    } catch(err) {
        res.status(500).json({ errors: 'Something went wrong!'})
    }
}

