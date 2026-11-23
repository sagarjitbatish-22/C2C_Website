// server/models/InstagramPost.js
const mongoose = require('mongoose');

const instagramPostSchema = new mongoose.Schema({
  caption: { type: String, required: true },
  imageUrl: { type: String, required: true },
  postUrl: { type: String, default: 'https://instagram.com/code2chill' },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  date: { type: String, default: 'Recent' },
  type: { type: String, default: 'post' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.InstagramPost || mongoose.model('InstagramPost', instagramPostSchema);
