const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { protect } = require('../middleware/authMiddleware');
const Subscription = require('../models/Subscription');
const User = require('../models/User');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ─── Plans config ──────────────────────────────────
const PLANS = {
  monthly: { amount: 49900, duration: 30 },   // ₹499
  yearly:  { amount: 399900, duration: 365 },  // ₹3999
};

// ─── POST /api/payments/create-order ──────────────
router.post('/create-order', protect, async (req, res) => {
  try {
    const { plan } = req.body;

    if (!PLANS[plan]) {
      return res.status(400).json({ message: 'Invalid plan' });
    }

    const options = {
      amount: PLANS[plan].amount, // amount in paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      plan,
      keyId: process.env.RAZORPAY_KEY_ID,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── POST /api/payments/verify ─────────────────────
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, plan } = req.body;

    // 1. Verify signature
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // 2. Create subscription
    const duration = PLANS[plan].duration;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + duration);

    const subscription = await Subscription.create({
      user: req.user._id,
      plan,
      amount: PLANS[plan].amount / 100,
      razorpayOrderId,
      razorpayPaymentId,
      endDate,
    });

    // 3. Link subscription to user
    await User.findByIdAndUpdate(req.user._id, {
      subscription: subscription._id,
    });

    res.json({ message: 'Payment verified, subscription activated!', subscription });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── GET /api/payments/my-subscription ────────────
router.get('/my-subscription', protect, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: 'active',
    });

    if (!subscription) {
      return res.status(404).json({ message: 'No active subscription found' });
    }

    res.json({ subscription });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── GET /api/payments/history ─────────────────────
router.get('/history', protect, async (req, res) => {
  try {
    const payments = await Subscription.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ payments });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;