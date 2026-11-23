// server/index.js - Code2Chill Backend Server
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Always start the server immediately — MongoDB connects in background
app.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 Code2Chill API running at http://127.0.0.1:${PORT}`);
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
