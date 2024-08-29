import express from "express";
import mongoose from "mongoose";
import cors from 'cors'
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'
import userRouter from './routes/user-route.js'
import authRouter from './routes/auth-route.js'
import listingRouter from './routes/listing-route.js'
import adminRouter from './routes/admin-route.js'
import path from 'path'
import { fileURLToPath } from 'url'
dotenv.config()

mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log('Connected to MongoDB!');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

const app = express()

app.use(express.json())

app.use(cookieParser())

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(path.join(__dirname, '../public')))

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

app.listen(5555, () => {
    console.log('Server is running on port 5555!')
})

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/listing', listingRouter)
app.use('/api/admin', adminRouter)