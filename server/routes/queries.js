// server/routes/queries.js
const express = require('express');
const router = express.Router();
const { store } = require('../storage');
const Query = require('../models/Query');
const { adminMiddleware, rateLimit } = require('../middleware/auth');

const isMongoConnected = () => {
  const mongoose = require('mongoose');
  return mongoose.connection.readyState === 1;
};

// Public endpoint: limit spam (5 queries per 10 minutes per IP)
const queryLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 5, message: 'Too many queries submitted. Please try again in a few minutes.' });

// POST /api/queries - Submit a new query (Public "Ask Query" button)
router.post('/', queryLimiter, async (req, res) => {
  try {
    const { name, email, rollNumber, category, subject, message } = req.body;

    if (![name, email, subject, message].every(v => typeof v === 'string' && v.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, subject, and message are mandatory.'
      });
    }

    if (name.length > 100 || email.length > 254 || subject.length > 200 || message.length > 3000 ||
        (rollNumber && String(rollNumber).length > 30) || (category && String(category).length > 50)) {
      return res.status(400).json({ success: false, message: 'One or more fields are too long.' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    if (isMongoConnected()) {
      const newQuery = new Query({
        name,
        email: email.trim().toLowerCase(),
        rollNumber: rollNumber || '',
        category: category || 'General',
        subject,
        message,
        status: 'Pending'
      });
      await newQuery.save();

      return res.status(201).json({
        success: true,
        message: 'Query submitted successfully! Code2Chill core team will get back to you shortly.',
        data: newQuery
      });
    }

    const newQuery = {
      id: 'qry-' + Date.now(),
      name,
      email: email.trim().toLowerCase(),
      rollNumber: rollNumber || '',
      category: category || 'General',
      subject,
      message,
      status: 'Pending',
      reply: '',
      createdAt: new Date().toISOString()
    };
    store.queries.unshift(newQuery);

    res.status(201).json({
      success: true,
      message: 'Query submitted successfully! Code2Chill core team will get back to you shortly.',
      data: newQuery
    });
  } catch (error) {
    console.error('Submit Query Error:', error);
    res.status(500).json({ success: false, message: 'Could not submit your query.' });
  }
});

// GET /api/queries - View all submitted queries (Admin only: Sagarjit)
router.get('/', adminMiddleware, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const queries = await Query.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: queries.length, data: queries });
    }

    res.json({ success: true, count: store.queries.length, data: store.queries });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not fetch queries.' });
  }
});

// PATCH /api/queries/:id/reply - Update query status or reply (Admin only: Sagarjit)
router.patch('/:id/reply', adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { reply, status } = req.body;

    if (isMongoConnected()) {
      const qry = await Query.findById(id);
      if (qry) {
        if (reply) qry.reply = reply;
        if (status) qry.status = status;
        await qry.save();
        return res.json({ success: true, message: 'Query updated successfully!', data: qry });
      }
    }

    const qry = store.queries.find(q => q.id === id || q._id === id);
    if (qry) {
      if (reply) qry.reply = reply;
      if (status) qry.status = status;
      return res.json({ success: true, message: 'Query updated successfully!', data: qry });
    }

    res.status(404).json({ success: false, message: 'Query not found.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update query.' });
  }
});

module.exports = router;
