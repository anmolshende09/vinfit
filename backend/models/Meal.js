const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    date: {
      type: String, // "YYYY-MM-DD"
      required: true,
    },

    // 🔥 Dynamic meals (KEY CHANGE)
    meals: {
      type: Map,
      of: Boolean,
      default: {},
    },

    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// One log per user per day
MealSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Meal', MealSchema);