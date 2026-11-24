// server/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Team Member' },
  domain: { type: String, default: 'Technical' },
  department: { type: String, default: 'CSE' },
  rollNumber: { type: String, default: '' },
  isAdmin: { type: Boolean, default: false },
  joinedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
