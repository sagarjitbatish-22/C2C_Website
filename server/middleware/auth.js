// server/middleware/auth.js
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// JWT secret must come from the environment. If it is missing we generate a random one
// at startup so the server still works (sessions just reset on restart) instead of
// falling back to a secret that anyone can read in the repo.
let JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  JWT_SECRET = crypto.randomBytes(48).toString('hex');
  console.warn('⚠️  JWT_SECRET is not set. Using a temporary random secret; logins will reset on every restart. Set JWT_SECRET in your environment.');
}

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'sagarjit2174.beaiml26@gmail.com').trim().toLowerCase();

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session. Please login again.' });
  }
}

// Restricts operations to the administrator account
function adminMiddleware(req, res, next) {
  authMiddleware(req, res, () => {
    const isAuthorized = req.user && (
      req.user.email?.toLowerCase() === ADMIN_EMAIL ||
      req.user.isAdmin === true
    );

    if (isAuthorized) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied: administrator access required.'
    });
  });
}

// Tiny in-memory rate limiter (no extra dependency). Keyed by IP + route.
function rateLimit({ windowMs, max, message }) {
  const hits = new Map();
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits) {
      if (entry.resetAt <= now) hits.delete(key);
    }
  }, windowMs).unref();

  return (req, res, next) => {
    const key = `${req.ip}:${req.baseUrl}${req.path}`;
    const now = Date.now();
    const entry = hits.get(key);
    if (!entry || entry.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }
    entry.count += 1;
    if (entry.count > max) {
      return res.status(429).json({ success: false, message: message || 'Too many requests. Please try again later.' });
    }
    next();
  };
}

module.exports = {
  authMiddleware,
  adminMiddleware,
  rateLimit,
  ADMIN_EMAIL,
  JWT_SECRET
};
