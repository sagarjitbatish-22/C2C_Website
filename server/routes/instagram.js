// server/routes/instagram.js
const express = require('express');
const router = express.Router();
const { store } = require('../storage');
const InstagramPost = require('../models/InstagramPost');
const { authMiddleware } = require('../middleware/auth');

const isMongoConnected = () => {
  const mongoose = require('mongoose');
  return mongoose.connection.readyState === 1;
};

// GET /api/instagram - Get Instagram handle info & recent posts
router.get('/', async (req, res) => {
  try {
    const clubInfo = {
      handle: "@code2chill.osl",
      officialUrl: "https://www.instagram.com/code2chill.osl?jplx=MWcxZzV0d3lhdmJnag==",
      followers: "Active",
      postsCount: "Community",
      bio: "Official Coding & Tech Club of Chitkara University, Rajpura ⚡ Hackathons, DSA, AI/ML & Chill."
    };

    let posts = store.instagramPosts;
    if (isMongoConnected()) {
      const dbPosts = await InstagramPost.find().sort({ createdAt: -1 });
      if (dbPosts.length > 0) {
        posts = dbPosts;
      }
    }

    res.json({
      success: true,
      clubInfo,
      posts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve Instagram feed.' });
  }
});

// POST /api/instagram - Publish / sync new post (Team Member only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { caption, imageUrl, postUrl, likes, comments, type } = req.body;
    if (!caption || !imageUrl) {
      return res.status(400).json({ success: false, message: 'Caption and image URL are required.' });
    }

    if (isMongoConnected()) {
      const newPost = new InstagramPost({
        caption,
        imageUrl,
        postUrl: postUrl || 'https://www.instagram.com/code2chill.osl',
        likes: likes || Math.floor(Math.random() * 200 + 150),
        comments: comments || Math.floor(Math.random() * 25 + 5),
        type: type || 'post',
        date: 'Just now'
      });
      await newPost.save();
      return res.status(201).json({ success: true, data: newPost });
    }

    const newPost = {
      id: 'ig-' + Date.now(),
      caption,
      imageUrl,
      postUrl: postUrl || 'https://www.instagram.com/code2chill.osl',
      likes: likes || Math.floor(Math.random() * 200 + 150),
      comments: comments || Math.floor(Math.random() * 25 + 5),
      type: type || 'post',
      date: 'Just now'
    };
    store.instagramPosts.unshift(newPost);

    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not add Instagram post.' });
  }
});

module.exports = router;
