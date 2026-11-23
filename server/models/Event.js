// server/models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tagline: { type: String, default: '' },
  description: { type: String, required: true },
  category: { type: String, default: 'Workshop' },
  date: { type: String, required: true },
  time: { type: String, default: '05:00 PM IST' },
  venue: { type: String, required: true },
  status: { type: String, enum: ['Upcoming', 'Completed', 'Ongoing'], default: 'Upcoming' },
  registrationUrl: { type: String, default: '' },
  rsvpCount: { type: Number, default: 0 },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Event || mongoose.model('Event', eventSchema);
