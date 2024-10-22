const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');

const User = require('../models/User');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  [
    // Validate the username - it must be provided and alphanumeric
    check('username', 'Username is required and must be alphanumeric')
      .notEmpty() // Ensures the username is not empty
      .isAlphanumeric(), // Ensures the username only contains letters and numbers
    // Validate the email - it must be in a valid email format
    check('email', 'Please include a valid email').isEmail(),
    // Validate the password - it must be at least 6 characters long
    check('password', 'Password must be 6 or more characters').isLength({
      min: 6, // Password must have a minimum length of 6 characters
    }),
  ],
  async (req, res) => {
    // Handle validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are validation errors, return them to the client
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      // Check if a user with the given email or username already exists
      let user = await User.findOne({ $or: [{ email }, { username }] });
      if (user) {
        // If user exists, return an error message indicating a conflict
        return res
          .status(400)
          .json({ msg: 'Email or username already exists' });
      }

      // Create a new user instance
      user = new User({
        username,
        email,
        password, // Password will be hashed before saving (handled by pre-save middleware)
      });

      // Save the user to the database
      await user.save();

      // Create a payload for JWT which contains the user ID
      const payload = {
        user: {
          id: user.id, // Include the user's unique ID in the token payload
        },
      };

      // Sign the JWT and send it in the response
      jwt.sign(
        payload,
        process.env.JWT_SECRET, // Use a secret key from environment variables
        { expiresIn: '1h' }, // Set token expiration time to 1 hour
        (err, token) => {
          if (err) throw err; // Handle any error during token signing
          res.json({ token }); // Send the generated token to the client
        }
      );
    } catch (err) {
      console.error(err.message); // Log any server error to the console for debugging
      res.status(500).send('Server error'); // Return a server error response
    }
  }
);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get token
 * @access  Public
 */
router.post(
  '/login',
  [
    // Validate the email - it must be in a valid email format
    check('email', 'Please include a valid email').isEmail(),
    // Validate the password - it must be provided
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    // Handle validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are validation errors, return them to the client
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if the user exists by email
      let user = await User.findOne({ email });
      if (!user) {
        // If user does not exist, return an error message
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // Compare the provided password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        // If passwords do not match, return an error message
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // Create a payload for JWT which contains the user ID
      const payload = {
        user: {
          id: user.id, // Include the user's unique ID in the token payload
        },
      };

      // Sign the JWT and send it in the response
      jwt.sign(
        payload,
        process.env.JWT_SECRET, // Use a secret key from environment variables
        { expiresIn: '1h' }, // Set token expiration time to 1 hour
        (err, token) => {
          if (err) throw err; // Handle any error during token signing
          res.json({ token }); // Send the generated token to the client
        }
      );
    } catch (err) {
      console.error(err.message); // Log any server error to the console for debugging
      res.status(500).send('Server error'); // Return a server error response
    }
  }
);

/**
 * @route   GET /api/auth/user
 * @desc    Get authenticated user
 * @access  Private
 */
router.get('/user', authMiddleware, async (req, res) => {
  try {
    // Retrieve user data by ID, excluding the password field
    const user = await User.findById(req.user.id).select('-password'); // Do not include the password in the response
    res.json(user); // Send the user data to the client
  } catch (err) {
    console.error(err.message); // Log any server error to the console for debugging
    res.status(500).send('Server error'); // Return a server error response
  }
});

module.exports = router;
