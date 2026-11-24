// server/routes/team.js
const express = require('express');
const router = express.Router();
const { store } = require('../storage');
const Team = require('../models/Team');
const { adminMiddleware } = require('../middleware/auth');

const isMongoConnected = () => {
  const mongoose = require('mongoose');
  return mongoose.connection.readyState === 1;
};

// GET /api/team - List all team members
router.get('/', async (req, res) => {
  try {
    if (isMongoConnected()) {
      let team = await Team.find().sort({ order: 1 });
      // Seed the default roster only when the collection is empty.
      // (Previously any public GET could wipe the whole collection, including members added by the admin.)
      if (team.length === 0) {
        await Team.insertMany(store.team);
        team = await Team.find().sort({ order: 1 });
      }
      return res.json({ success: true, count: team.length, data: team });
    }
    res.json({ success: true, count: store.team.length, data: store.team });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not fetch team details.' });
  }
});

// POST /api/team - Add team member (Admin only: Sagarjit)
router.post('/', adminMiddleware, async (req, res) => {
  try {
    const { name, role, domain, year, image, github, linkedin, quote } = req.body;
    if (!name || !role || !domain) {
      return res.status(400).json({ success: false, message: 'Name, role, and domain are required.' });
    }

    if (isMongoConnected()) {
      const newMember = new Team({
        name,
        role,
        domain,
        year: year || '3rd Year, CSE',
        image: image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        github: github || '',
        linkedin: linkedin || '',
        quote: quote || ''
      });
      await newMember.save();
      return res.status(201).json({ success: true, data: newMember });
    }

    const newMember = {
      id: 'tm-' + Date.now(),
      name,
      role,
      domain,
      year: year || '3rd Year, CSE',
      image: image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      github: github || '',
      linkedin: linkedin || '',
      quote: quote || ''
    };
    store.team.push(newMember);

    res.status(201).json({ success: true, data: newMember });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add team member.' });
  }
});

module.exports = router;
