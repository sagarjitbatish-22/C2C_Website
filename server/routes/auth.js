// server/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, authMiddleware, rateLimit, ADMIN_EMAIL } = require('../middleware/auth');
const { sendRegistrationEmail } = require('../mailer');
const { store } = require('../storage');
const User = require('../models/User');

// Secrets come from the environment only. Never hardcode them in the repo.
//   CLUB_ACCESS_KEY  - passcode new team members must enter to register
//   ADMIN_PASSWORD   - master password for the admin account
const CLUB_ACCESS_KEY = (process.env.CLUB_ACCESS_KEY || '').trim().toUpperCase();
const ADMIN_PASS = process.env.ADMIN_PASSWORD || '';

if (!CLUB_ACCESS_KEY) console.warn('⚠️  CLUB_ACCESS_KEY is not set: team registration is disabled.');
if (!ADMIN_PASS) console.warn('⚠️  ADMIN_PASSWORD is not set: admin login is disabled.');

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: 'Too many login attempts. Try again in 15 minutes.' });
const registerLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 10, message: 'Too many registration attempts. Try again later.' });

const isValidEmail = (e) => typeof e === 'string' && e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

// Helper to check DB mode
const isMongoConnected = () => {
  const mongoose = require('mongoose');
  return mongoose.connection.readyState === 1;
};

// POST /api/auth/register
// Team member registration
router.post('/register', registerLimiter, async (req, res) => {
  try {
    const { name, email, password, role, domain, department, clubKey } = req.body;

    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string' || !name.trim() || !email.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required fields.'
      });
    }

    if (name.length > 100 || !isValidEmail(email.trim())) {
      return res.status(400).json({ success: false, message: 'Please enter a valid name and email address.' });
    }

    if (password.length < 8 || password.length > 128) {
      return res.status(400).json({ success: false, message: 'Password must be between 8 and 128 characters.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const isAdminAccount = cleanEmail === ADMIN_EMAIL;

    // The admin account can never be created through public registration;
    // it is created on first login with ADMIN_PASSWORD.
    if (isAdminAccount) {
      return res.status(403).json({ success: false, message: 'This email cannot be registered here.' });
    }

    // Club passcode is mandatory for every registration.
    if (!CLUB_ACCESS_KEY) {
      return res.status(503).json({ success: false, message: 'Registration is currently closed.' });
    }
    if (typeof clubKey !== 'string' || clubKey.trim().toUpperCase() !== CLUB_ACCESS_KEY) {
      return res.status(403).json({
        success: false,
        message: 'Invalid Club Passcode. Ask your Code2Chill Lead for the current passcode.'
      });
    }

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
        role: isAdminAccount ? 'Admin' : (role || 'Team Member'),
        domain: isAdminAccount ? 'Technical Core' : (domain || 'Technical Core'),
        department: department || 'CSE',
        isAdmin: isAdminAccount
      });

      await newUser.save();

      // Send automated welcome email
      sendRegistrationEmail(cleanEmail, name).catch(err => {
        console.warn('Email dispatch notice:', err.message);
      });

      return res.status(201).json({
        success: true,
        message: 'Registration successful! A welcome confirmation email has been dispatched to your inbox.',
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          domain: newUser.domain,
          isAdmin: newUser.isAdmin
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
        role: isAdminAccount ? 'Admin' : (role || 'Team Member'),
        domain: isAdminAccount ? 'Technical Core' : (domain || 'Technical Core'),
        department: department || 'CSE',
        isAdmin: isAdminAccount,
        joinedAt: new Date().toISOString()
      };

      store.users.push(newUser);

      // Send automated welcome email
      sendRegistrationEmail(cleanEmail, name).catch(err => {
        console.warn('Email dispatch notice:', err.message);
      });

      return res.status(201).json({
        success: true,
        message: 'Registration successful! A welcome confirmation email has been dispatched to your inbox.',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          domain: newUser.domain,
          isAdmin: newUser.isAdmin
        }
      });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
});

// POST /api/auth/login
// Team member / Admin sign-in
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const isAdminAccount = cleanEmail === ADMIN_EMAIL;

    // 1. Dedicated Master Admin check (password comes from ADMIN_PASSWORD env var)
    const adminPassOk = ADMIN_PASS && password.length === ADMIN_PASS.length &&
      require('crypto').timingSafeEqual(Buffer.from(password), Buffer.from(ADMIN_PASS));
    if (isAdminAccount && adminPassOk) {
      let adminUser = null;
      if (isMongoConnected()) {
        adminUser = await User.findOne({ email: cleanEmail });
        if (!adminUser) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(ADMIN_PASS, salt);
          adminUser = new User({
            name: 'Sagarjit Singh Batish',
            email: ADMIN_EMAIL,
            password: hashedPassword,
            role: 'Admin',
            domain: 'Technical Core',
            department: 'AI & ML',
            isAdmin: true
          });
          await adminUser.save();
        } else if (!adminUser.isAdmin) {
          adminUser.isAdmin = true;
          adminUser.role = 'Admin';
          await adminUser.save();
        }
      }

      const payload = {
        id: adminUser?._id || 'usr-admin-sagarjit',
        name: adminUser?.name || 'Sagarjit Singh Batish',
        email: ADMIN_EMAIL,
        role: 'Admin',
        domain: 'Technical Core',
        isAdmin: true
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
      return res.json({
        success: true,
        message: 'Welcome back, Sagarjit (Admin)!',
        token,
        user: payload
      });
    }

    // The admin account can only sign in with ADMIN_PASSWORD (handled above)
    if (isAdminAccount) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // 2. Standard authentication
    let user = null;
    if (isMongoConnected()) {
      user = await User.findOne({ email: cleanEmail });
    } else {
      user = store.users.find(u => u.email === cleanEmail);
    }

    // Same response for "no such user" and "wrong password" so emails can't be enumerated
    const isMatch = user ? await bcrypt.compare(password, user.password) : false;
    if (!user || !isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. New here? Register as a team member first.'
      });
    }

    const isUserAdmin = user.isAdmin === true;
    const payload = {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: isUserAdmin ? 'Admin' : user.role,
      domain: user.domain,
      isAdmin: isUserAdmin
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
// Get authenticated profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const isUserAdmin = req.user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() || req.user.isAdmin === true;
    res.json({
      success: true,
      user: {
        ...req.user,
        isAdmin: isUserAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve profile.' });
  }
});

module.exports = router;
