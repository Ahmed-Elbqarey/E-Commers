const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = function(req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded.user;
        
        // Check if user is blocked
        User.findById(req.user.id).then(user => {
            if (user && user.isBlocked) {
                return res.status(403).json({ message: 'تم حظر حسابك من قبل الإدارة' });
            }
            next();
        }).catch(err => {
            res.status(500).json({ message: 'Server error' });
        });
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
}; 