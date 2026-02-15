const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header('Authorization'); // Format: "Bearer <token>" or just "<token>"

    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const bearer = token.split(' ');
        const tokenValue = bearer.length === 2 ? bearer[1] : token;

        const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
