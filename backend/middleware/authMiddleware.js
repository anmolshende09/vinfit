const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check if token exists in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach user to request (exclude password)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    next();

  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Trainer only access
const trainerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'trainer') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied, trainer only' });
  }
};

module.exports = { protect, trainerOnly };