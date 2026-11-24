// server/middleware/auth.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'code2chill_chitkara_secret_key_2026';
const ADMIN_EMAIL = 'sagarjit2174.beaiml26@gmail.com';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session. Please login again.' });
  }
}

// Restricts operations exclusively to Sagarjit (sagarjit2174.beaiml26@gmail.com)
function adminMiddleware(req, res, next) {
  authMiddleware(req, res, () => {
    const isAuthorized = req.user && (
      req.user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ||
      req.user.isAdmin === true
    );

    if (isAuthorized) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Access denied: Only administrator (${ADMIN_EMAIL}) can perform this action.`
    });
  });
}

module.exports = {
  authMiddleware,
  adminMiddleware,
  ADMIN_EMAIL,
  JWT_SECRET
};
