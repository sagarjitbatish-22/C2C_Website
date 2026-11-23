// server/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, authMiddleware } = require('../middleware/auth');
const { store } = require('../storage');
const User = require('../models/User');

const CLUB_ACCESS_KEY = process.env.CLUB_ACCESS_KEY || 'CHITKARA2026';

// Helper to check DB mode
const isMongoConnected = () => {
  const mongoose = require('mongoose');
  return mongoose.connection.readyState === 1;
};

// POST /api/auth/register
// Team member registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, domain, department, clubKey } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required fields.'
      });
    }

    // Optional verification code check for team member authenticity
    if (clubKey && clubKey.trim().toUpperCase() !== CLUB_ACCESS_KEY && clubKey.trim().toUpperCase() !== 'C2C2026') {
      return res.status(403).json({
        success: false,
        message: 'Invalid Club Passcode. Ask your Code2Chill Lead or use: CHITKARA2026'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    if (isMongoConnected()) {
      const existing = await User.findOne({ email: cleanEmail });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'This email is already registered. Please proceed to login.'
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        name,
        email: cleanEmail,
        password: hashedPassword,
        role: role || 'Team Member',
        domain: domain || 'Technical Core',
        department: department || 'CSE'
      });

      await newUser.save();

      return res.status(201).json({
        success: true,
        message: 'Registration successful! You may now sign in with your credentials.',
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          domain: newUser.domain
        }
      });
    } else {
      // In-Memory store fallback
      const existing = store.users.find(u => u.email === cleanEmail);
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'This email is already registered. Please proceed to login.'
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        id: 'usr-' + Date.now(),
        name,
        email: cleanEmail,
        password: hashedPassword,
        role: role || 'Team Member',
        domain: domain || 'Technical Core',
        department: department || 'CSE',
        joinedAt: new Date().toISOString()
      };

      store.users.push(newUser);

      return res.status(201).json({
        success: true,
        message: 'Registration successful! You may now sign in with your credentials.',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          domain: newUser.domain
        }
      });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
});

// POST /api/auth/login
// Team member sign-in
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    let user = null;
    if (isMongoConnected()) {
      user = await User.findOne({ email: cleanEmail });
    } else {
      user = store.users.find(u => u.email === cleanEmail);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Account not registered. Please register as a team member first.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your password.'
      });
    }

    const payload = {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      domain: user.domain
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: payload
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error during authentication.' });
  }
});

// GET /api/auth/me
// Get authenticated team member
router.get('/me', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve profile.' });
  }
});

module.exports = router;
