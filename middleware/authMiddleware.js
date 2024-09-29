const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');

    // Check if the Authorization header exists
    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: decoded.userId, role: decoded.role };
        next();
    } catch (err) {
        console.error('JWT Error:', err);
        return res.status(401).json({ message: 'Token is not valid' });
    }
};

// Admin middleware: checks if the user has admin privileges
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        console.log('User Role:', req.user.role);
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    } else {
        return res.status(403).json({ message: 'Not authorized as admin' });
    }
};

module.exports = { authMiddleware, admin };