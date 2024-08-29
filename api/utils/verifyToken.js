import jwt from 'jsonwebtoken'
import User from '../models/user-model.js'

export const verifyToken = async (req, res, next) => {
    const token = req.cookies.access_token
    if(!token) {
        return res.status(400).json({ error: 'token is required' })
    }

    try {
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(tokenData.id).exec(); // <-- This line
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        req.user = user; // <-- This should be populated with user data
        console.log('Token verified', tokenData);
        next();
    } catch (err) {
        console.error('Token verification failed:', err);
        return res.status(400).json({ error: 'Invalid token' });
    }
}