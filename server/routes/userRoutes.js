const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Search Users
router.get('/', async (req, res) => {
  try {
    const { username } = req.query;
    const users = await User.find({ username: { $regex: new RegExp(username, 'i') } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
