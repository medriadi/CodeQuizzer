const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

/**
 * @route   GET /api/profile
 * @desc    Get current user's profile
 * @access  Private
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route   PUT /api/profile
 * @desc    Update user's profile
 * @access  Private
 */
router.put(
  '/',
  [
    authMiddleware,
    [
      check('username', 'Username is required').not().isEmpty(),
      check('email', 'Please include a valid email').isEmail(),
      check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      let user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      // Check if email is being updated and already exists
      if (email !== user.email) {
        let existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ msg: 'Email already in use' });
        }
      }

      // Update user fields
      user.username = username;
      user.email = email;

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      res.json({ msg: 'Profile updated successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
