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
    const user = await User.findById(req.user.id)
      .select('-password')
      .lean();

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
      check('username', 'Username is required and must be alphanumeric')
        .optional()
        .isAlphanumeric(),
      check('email', 'Please include a valid email').optional().isEmail(),
      check('password', 'Password must be 6 or more characters')
        .optional()
        .isLength({ min: 6 }),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return the array of validation errors
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      let user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      // Check if username is being updated and already exists
      if (username && username !== user.username) {
        let existingUser = await User.findOne({ username });
        if (existingUser) {
          return res.status(400).json({ msg: 'Username already in use' });
        }
        user.username = username;
      }

      // Check if email is being updated and already exists
      if (email && email !== user.email) {
        let existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ msg: 'Email already in use' });
        }
        user.email = email;
        // Optionally, set a flag to verify new email
      }

      // Update password if provided
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }

      await user.save();

      res.json({ msg: 'Profile updated successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
