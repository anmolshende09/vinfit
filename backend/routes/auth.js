const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// ─── Helper: generate signed JWT ──────────────────
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// ─── POST /api/auth/register ───────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // 2. Create user (password gets hashed by pre-save hook)
    const user = await User.create({ name, email, password, role });

    // 3. Generate email verification token
    const rawToken = user.getEmailVerifyToken();
    await user.save(); // save the hashed token + expiry to DB

    // 4. Build verification link
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${rawToken}`;

    // 5. Send verification email
    await sendEmail({
      to: user.email,
      subject: 'Verify your email',
      html: `
        <h2>Welcome to Fitness App, ${user.name}!</h2>
        <p>Click the link below to verify your email. It expires in 24 hours.</p>
        <a href="${verifyUrl}" style="
          display:inline-block;padding:12px 24px;
          background:#6366f1;color:#fff;
          border-radius:8px;text-decoration:none;
        ">Verify Email</a>
        <p>Or paste this URL: ${verifyUrl}</p>
      `,
    });

    res.status(201).json({
      message: 'Registered successfully. Check your email to verify your account.',
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── GET /api/auth/verify-email/:token ────────────
router.get('/verify-email/:token', async (req, res) => {
  try {
    // 1. Hash the raw token from the URL
    const hashed = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    // 2. Find user with matching token that hasn't expired
    const user = await User.findOne({
      emailVerifyToken: hashed,
      emailVerifyExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification link' });
    }

    // 3. Mark as verified, clear token fields
    user.isEmailVerified = true;
    user.emailVerifyToken = undefined;
    user.emailVerifyExpire = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully. You can now log in.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ─── POST /api/auth/login ──────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists (include password since select:false)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 2. Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(401).json({ message: 'Please verify your email before logging in' });
    }

    // 3. Compare password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 4. Generate JWT
    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,//ungli
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── GET /api/auth/verify-email/:token ────────────
router.get('/verify-email/:token', async (req, res) => {
  try {
    const hashed = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      emailVerifyToken: hashed,
      emailVerifyExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification link' });
    }

    user.isEmailVerified = true;
    user.emailVerifyToken = undefined;
    user.emailVerifyExpire = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully. You can now log in.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// // ─── TEMP: manually verify email (remove after testing) ──
// router.get('/temp-verify/:email', async (req, res) => {
//   try {
//     await User.updateOne(
//       { email: req.params.email },
//       { $set: { isEmailVerified: true } }
//     );
//     res.json({ message: 'User verified' });
//   } catch (err) {
//     res.status(500).json({ message: 'Error' });
//   }
// });

const { protect, trainerOnly } = require('../middleware/authMiddleware');

// ─── GET /api/auth/me (protected) ─────────────────
router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user });
});

// ─── GET /api/auth/trainer-only (trainer only) ────
router.get('/trainer-only', protect, trainerOnly, (req, res) => {
  res.json({ message: `Welcome trainer ${req.user.name}!` });
});

// ─── POST /api/auth/forgot-password ───────────────
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account with that email found' });
    }

    // 1. Generate reset token
    const rawToken = user.getResetPasswordToken();
    await user.save();

    // 2. Build reset link
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;

    // 3. Send email
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset</h2>
        <p>You requested a password reset. Click the link below — it expires in 30 minutes.</p>
        <a href="${resetUrl}" style="
          display:inline-block;padding:12px 24px;
          background:#6366f1;color:#fff;
          border-radius:8px;text-decoration:none;
        ">Reset Password</a>
        <p>If you didn't request this, ignore this email.</p>
        <p>Or paste this URL: ${resetUrl}</p>
      `,
    });

    res.json({ message: 'Password reset email sent' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── POST /api/auth/reset-password/:token ─────────
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { password } = req.body;

    // 1. Hash the token from URL
    const hashed = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    // 2. Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset link' });
    }

    // 3. Update password (pre-save hook will hash it)
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // 4. Return new token so user is logged in immediately
    const token = generateToken(user._id);

    res.json({
      message: 'Password reset successful',
      token,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
