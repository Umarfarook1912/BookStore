const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(payload.id).select('-password');
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

const authorize = (roles = []) => {
    if (typeof roles === 'string') roles = [roles];
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};

module.exports = { auth, authorize };
