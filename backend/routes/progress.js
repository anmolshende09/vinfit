const express = require('express');
const router = express.Router();
const Meal = require('../models/Meal');
const { protect } = require('../middleware/authMiddleware');

// ─── GET /api/progress/summary ─────────────────────
router.get('/summary', protect, async (req, res) => {
  try {
    // 1. Get last 30 days of meal logs
    const meals = await Meal.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(30);

    const totalDays = meals.length;

 if (totalDays === 0) {
  return res.json({
    disciplineScore: 0,
    mealConsistency: 0,
    totalDaysLogged: 0,
    completedMeals: 0,
    totalMeals: 0,
    streak: 0,
    breakdown: {},
    meals: [],
  });
}

    // 2. Count completed meals
         let totalMeals = 0;
        let completedMeals = 0;
         const breakdown = {};

meals.forEach((meal) => {
  // Convert Mongoose Map to plain object
  const mealEntries = meal.meals instanceof Map
    ? Object.fromEntries(meal.meals)
    : (meal.meals ? Object.fromEntries(Object.entries(meal.meals)) : {});

  Object.entries(mealEntries).forEach(([type, value]) => {
    if (!breakdown[type]) {
      breakdown[type] = { done: 0, total: 0 };
    }

    breakdown[type].total++;

    if (value) {
      completedMeals++;
      breakdown[type].done++;
    }

    totalMeals++;
  });
});
    // 3. Calculate scores
    const mealConsistency =
              totalMeals === 0
                ? 0
                : Math.round((completedMeals / totalMeals) * 100);
            
    let disciplineScore = mealConsistency;
    // +10 bonus if logged every day this week
    const recentDays = meals.slice(0, 7).length;
    if (recentDays >= 7) disciplineScore = Math.min(100, disciplineScore + 10);
    // -10 penalty if missed 2+ days in a row
    if (totalDays < 5) disciplineScore = Math.max(0, disciplineScore - 10);

    // 4. Build streak
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const sortedDates = meals.map(m => m.date).sort().reverse();
    for (let i = 0; i < sortedDates.length; i++) {
      const expected = new Date();
      expected.setDate(expected.getDate() - i);
      const expectedStr = expected.toISOString().split('T')[0];
      if (sortedDates[i] === expectedStr) {
        streak++;
      } else {
        break;
      }
    }

    res.json({
      disciplineScore,
      mealConsistency,
      totalDaysLogged: totalDays,
      completedMeals,
      totalMeals,
      streak,
      breakdown,
      meals, // for graph
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;