const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // built-in Node.js, no install needed

const UserSchema = new mongoose.Schema(
  {
    // ─── Basic Info ───────────────────────────────
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // never returned in queries by default
    },

    // ─── Role ─────────────────────────────────────
    role: {
      type: String,
      enum: ['client', 'trainer'],
      default: 'client',
    },

    // ─── Fitness Profile ──────────────────────────
    age: { type: Number },
    weight: { type: Number },       // in kg
    goal: {
      type: String,
      enum: ['weight_loss', 'muscle_gain', 'maintenance', 'endurance'],
    },

    // ─── Subscription (ref to Subscription model later) ──
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
    },

    // ─── Email Verification ───────────────────────
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerifyToken: String,
    emailVerifyExpire: Date,

    // ─── Password Reset ───────────────────────────
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// ─── Hash password before saving ──────────────────
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ─── Compare entered password with hashed ─────────
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ─── Generate email verification token ───────────
UserSchema.methods.getEmailVerifyToken = function () {
  const token = crypto.randomBytes(32).toString('hex');

  // store hashed version in DB (never store raw token)
  this.emailVerifyToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  this.emailVerifyExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  return token; // send raw token in email link
};

// ─── Generate password reset token ────────────────
UserSchema.methods.getResetPasswordToken = function () {
  const token = crypto.randomBytes(32).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

  return token;
};

module.exports = mongoose.model('User', UserSchema);