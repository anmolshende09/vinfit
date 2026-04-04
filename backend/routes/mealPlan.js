const express = require("express");
const router = express.Router();
const MealPlan = require("../models/MealPlan");
const { protect } = require("../middleware/authMiddleware");


// 🔹 GET meal plan for logged user
router.get("/me", protect, async (req, res) => {
  let plan = await MealPlan.findOne({ user: req.user._id });

  if (!plan) {
    plan = await MealPlan.create({ user: req.user._id });
  }

  res.json(plan);
});


// 🔹 UPDATE meal plan (trainer)
router.post("/", protect, async (req, res) => {
  const { userId, meals } = req.body;

  let plan = await MealPlan.findOne({ user: userId });

  if (plan) {
    plan.meals = meals;
    await plan.save();
  } else {
    plan = await MealPlan.create({ user: userId, meals });
  }

  res.json(plan);
});

module.exports = router;