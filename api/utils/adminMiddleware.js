export const adminMiddleware = (req, res, next) => {
    console.log('Admin Middleware:', req.user); // Debug log
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ success: false, message: 'Access denied' });
    }
}