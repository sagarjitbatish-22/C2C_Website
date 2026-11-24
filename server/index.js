// server/index.js - Code2Chill Backend Server
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'https://sagarjitbatish-22.github.io'
];

// Extra allowed origins (e.g. a custom domain) can be set via ALLOWED_ORIGINS="https://a.com,https://b.com"
const extraOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);
const corsAllowList = new Set([...allowedOrigins, ...extraOrigins]);

// Render / Railway sit behind a proxy; this makes req.ip (used by the rate limiter) the real client IP
app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(cors({
  origin: function (origin, callback) {
    // No Origin header = same-origin / curl / server-to-server, which CORS doesn't apply to
    if (!origin || corsAllowList.has(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  }
}));
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// Routes
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const teamRoutes = require('./routes/team');
const queryRoutes = require('./routes/queries');
const instagramRoutes = require('./routes/instagram');

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/queries', queryRoutes);
app.use('/api/instagram', instagramRoutes);

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Code2Chill API is running live!',
    health: '/api/health',
    team: '/api/team',
    events: '/api/events'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    success: true,
    status: 'Code2Chill API is running',
    db: mongoose.connection.readyState === 1 ? 'MongoDB Connected' : 'Using In-Memory Storage',
    time: new Date().toISOString()
  });
});

// Always start the server immediately on 0.0.0.0 for cloud providers (Render, Railway, etc.)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Code2Chill API running on port ${PORT}`);
});

// Connect MongoDB if URI provided (5s timeout so it doesn't hang), else use in-memory store
if (MONGO_URI && MONGO_URI.trim() !== '') {
  mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
      console.log('✅ MongoDB connected successfully');
    })
    .catch(err => {
      console.warn('⚠️  MongoDB connection failed, using in-memory store:', err.message);
    });
} else {
  console.log('ℹ️  No MONGO_URI provided — using in-memory store (data resets on restart)');
}
