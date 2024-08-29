import mongoose from "mongoose";
const { Schema, model } = mongoose

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    avatar:{
        type: String,
        default: '/images/avatar.png'
    },
    otp: {
        type: String,
    },
    otpExpires: {
        type: Date,
    },
    isAdmin: { 
        type: Boolean, 
        default: false 
    }
}, {timestamps: true})

const User = model('User', userSchema)

export default User