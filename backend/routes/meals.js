const express = require('express');
const router = express.Router();
const Meal = require('../models/Meal');
const { protect } = require('../middleware/authMiddleware');

// ─── Helper: today's date ───
const today = () => {
  const d = new Date();
  return d.toLocaleDateString('en-CA'); // YYYY-MM-DD
};

// ─── POST /api/meals/log ───
// Create or update today's meal log (dynamic meals)
router.post('/log', protect, async (req, res) => {
  try {
    const { meals, notes, date } = req.body;
    const logDate = date || today();

    const meal = await Meal.findOneAndUpdate(
      { user: req.user._id, date: logDate },
      { meals, notes },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ message: 'Meal log saved', meal });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ─── GET /api/meals/today ───
router.get('/today', protect, async (req, res) => {
  try {
    let meal = await Meal.findOne({
      user: req.user._id,
      date: today(),
    });

    // 🔥 If no log exists → return empty dynamic structure
    if (!meal) {
      meal = {
        date: today(),
        meals: {},
        notes: '',
      };
    }

    res.json({ meal });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// ─── GET /api/meals/history ───
router.get('/history', protect, async (req, res) => {
  try {
    const meals = await Meal.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(30);

    res.json({ meals });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// ─── GET /api/meals/history/:date ───
router.get('/history/:date', protect, async (req, res) => {
  try {
    const meal = await Meal.findOne({
      user: req.user._id,
      date: req.params.date,
    });

    if (!meal) {
      return res.status(404).json({ message: 'No log found for this date' });
    }

    res.json({ meal });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;