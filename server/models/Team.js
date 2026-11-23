// server/models/Team.js
const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  domain: { type: String, required: true },
  year: { type: String, default: '3rd Year, CSE' },
  image: { type: String, default: '' },
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  quote: { type: String, default: '' },
  order: { type: Number, default: 0 }
});

module.exports = mongoose.models.Team || mongoose.model('Team', teamSchema);
