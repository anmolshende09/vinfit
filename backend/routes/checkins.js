const express = require('express');
const router = express.Router();
const CheckIn = require('../models/CheckIn');
const { protect } = require('../middleware/authMiddleware');

// helper: today date
const today = () => new Date().toISOString().split('T')[0];

// ─── POST /api/checkins ───────────────────────────
router.post('/', protect, async (req, res) => {
  try {
    const { weight, notes } = req.body;

    const checkin = await CheckIn.findOneAndUpdate(
      { user: req.user._id, date: today() },
      { weight, notes },
      { upsert: true, new: true, runValidators: true }
    );

    res.json({ message: 'Check-in saved', checkin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── GET /api/checkins/me ─────────────────────────
router.get('/me', protect, async (req, res) => {
  try {
    const checkins = await CheckIn.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(10);

    res.json({ checkins });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;