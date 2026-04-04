const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Meal = require('../models/Meal');
const { protect, trainerOnly } = require('../middleware/authMiddleware');

// ─── Helper: last 7 days ───────────────────────────
const getLast7Days = () => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
};

// ─── GET /api/trainer/dashboard ───────────────────
router.get('/dashboard', protect, trainerOnly, async (req, res) => {
  try {
    const clients = await User.find({ role: 'client' }).select('-password');

    const clientStats = await Promise.all(
      clients.map(async (client) => {

        const meals = await Meal.find({ user: client._id })
          .sort({ date: -1 })
          .limit(30);

        
          // ─── GET /api/trainer/client/:id/today ────────────
router.get('/client/:id/today', protect, trainerOnly, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const meal = await Meal.findOne({ user: req.params.id, date: today });

    if (!meal) return res.json({ meals: {} });

    const meals = meal.meals instanceof Map
      ? Object.fromEntries(meal.meals)
      : Object.fromEntries(Object.entries(meal.meals));

    res.json({ meals });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── PUT /api/trainer/client/:id/goal ─────────────
router.put('/client/:id/goal', protect, trainerOnly, async (req, res) => {
  try {
    const { goal } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { goal },
      { new: true }
    ).select('-password');

    res.json({ message: 'Goal updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


        // 🔥 CALCULATE MEAL COMPLETION
        const completedMeals = meals.reduce((acc, meal) => {
                      return acc + Object.values(meal.meals || {}).filter(Boolean).length;
                    }, 0);
                    
                    const totalMeals = meals.reduce((acc, meal) => {
                      return acc + Object.keys(meal.meals || {}).length;
                    }, 0);

        const consistency =
          totalMeals === 0
            ? 0
            : Math.round((completedMeals / totalMeals) * 100);

        // 🔥 LAST LOG
        const lastLog = meals[0]?.date || null;

        // 🔥 MISSED DAYS (last 7)
        const last7Days = getLast7Days();
        const loggedDates = meals.map((m) => m.date);

        const missedDays = last7Days.filter(
          (d) => !loggedDates.includes(d)
        ).length;

        // 🔥 IMPORTANT: send today's breakdown
        const today = new Date().toISOString().split('T')[0];
        const todayMeal = meals.find((m) => m.date === today);

        const todayCompleted = todayMeal
              ? Object.values(todayMeal.meals || {}).filter(Boolean).length
              : 0;
            
            const todayTotal = todayMeal
              ? Object.keys(todayMeal.meals || {}).length
              : 0;

        return {
          _id: client._id,
          name: client.name,
          email: client.email,
          goal: client.goal,

          consistency,
          totalDaysLogged: meals.length,
          lastLog,
          missedDays,

          // 🔥 NEW (for UI)
          todayCompleted,     // 0–4
          todayTotal,      // dynamic later
        };
      })
    );

    res.json({ clients: clientStats });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ─── GET /api/trainer/client/:id ──────────────────
router.get('/client/:id', protect, trainerOnly, async (req, res) => {
  try {
    const client = await User.findById(req.params.id).select('-password');

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const meals = await Meal.find({ user: client._id })
      .sort({ date: -1 })
      .limit(30);

      const completedMeals = meals.reduce((acc, meal) => {
        return acc + Object.values(meal.meals || {}).filter(Boolean).length;
      }, 0);

    const totalMeals = meals.reduce((acc, meal) => {
  return acc + Object.keys(meal.meals || {}).length;
        }, 0);

    const consistency =
      totalMeals === 0
        ? 0
        : Math.round((completedMeals / totalMeals) * 100);

    res.json({
      client,
      meals,
      consistency,
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;