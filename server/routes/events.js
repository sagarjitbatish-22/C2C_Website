// server/routes/events.js
const express = require('express');
const router = express.Router();
const { store } = require('../storage');
const Event = require('../models/Event');
const { adminMiddleware, rateLimit } = require('../middleware/auth');

// RSVP is public; stop one IP from spamming the counter
const rsvpLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 20, message: 'Too many RSVPs. Please slow down.' });

const isMongoConnected = () => {
  const mongoose = require('mongoose');
  return mongoose.connection.readyState === 1;
};

// GET /api/events - List all events
router.get('/', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const events = await Event.find().sort({ date: 1 });
      return res.json({ success: true, count: events.length, data: events });
    }
    res.json({ success: true, count: store.events.length, data: store.events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not fetch events.' });
  }
});

// POST /api/events - Create new event (Admin only: Sagarjit)
router.post('/', adminMiddleware, async (req, res) => {
  try {
    const { title, tagline, description, category, date, time, venue, status, tags } = req.body;

    if (!title || !description || !date || !venue) {
      return res.status(400).json({ success: false, message: 'Title, description, date, and venue are required.' });
    }

    if (isMongoConnected()) {
      const newEvent = new Event({
        title,
        tagline: tagline || '',
        description,
        category: category || 'Workshop',
        date,
        time: time || '05:00 PM IST',
        venue,
        status: status || 'Upcoming',
        tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : ['Tech', 'Chitkara'])
      });
      await newEvent.save();
      return res.status(201).json({ success: true, message: 'Event published successfully!', data: newEvent });
    }

    const newEvent = {
      id: 'evt-' + Date.now(),
      title,
      tagline: tagline || '',
      description,
      category: category || 'Workshop',
      date,
      time: time || '05:00 PM IST',
      venue,
      status: status || 'Upcoming',
      registrationUrl: '#query-modal',
      rsvpCount: 0,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : ['Tech', 'Chitkara'])
    };
    store.events.unshift(newEvent);

    res.status(201).json({ success: true, message: 'Event published successfully!', data: newEvent });
  } catch (error) {
    console.error('Create Event Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create event.' });
  }
});

// POST /api/events/:id/rsvp - RSVP to an event
router.post('/:id/rsvp', rsvpLimiter, async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected()) {
      const evt = await Event.findById(id);
      if (evt) {
        evt.rsvpCount = (evt.rsvpCount || 0) + 1;
        await evt.save();
        return res.json({ success: true, rsvpCount: evt.rsvpCount });
      }
    }

    const evt = store.events.find(e => e.id === id || e._id === id);
    if (evt) {
      evt.rsvpCount = (evt.rsvpCount || 0) + 1;
      return res.json({ success: true, rsvpCount: evt.rsvpCount });
    }

    res.status(404).json({ success: false, message: 'Event not found.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to RSVP.' });
  }
});

// DELETE /api/events/:id - Delete event (Admin only: Sagarjit)
router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected()) {
      await Event.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Event deleted.' });
    }

    store.events = store.events.filter(e => e.id !== id && e._id !== id);
    res.json({ success: true, message: 'Event deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not delete event.' });
  }
});

module.exports = router;
