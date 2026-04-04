const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, trainerOnly } = require('../middleware/authMiddleware');

// ─── GET /api/users/profile ────────────────────────
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ user });
     res.json({ user: req.user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── PUT /api/users/profile ────────────────────────
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, age, weight, goal } = req.body;

    const user = await User.findByIdAndUpdate(
      // req.user._id,
        req.user.id,

      { name, age, weight, goal },
      { new: true, runValidators: true }
    );

    res.json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── GET /api/users/trainer/clients ───────────────
router.get('/trainer/clients', protect, trainerOnly, async (req, res) => {
  try {
    const clients = await User.find({ role: 'client' }).select('-password');
    res.json({ clients });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── GET /api/users/trainer/clients/:id ───────────
router.get('/trainer/clients/:id', protect, trainerOnly, async (req, res) => {
  try {
    const client = await User.findById(req.params.id).select('-password');
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json({ client });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;