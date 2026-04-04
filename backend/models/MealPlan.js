const mongoose = require("mongoose");

const mealPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  meals: {
    type: [String],
    default: ["breakfast", "lunch", "dinner", "snacks"],
  },
});

module.exports = mongoose.model("MealPlan", mealPlanSchema);