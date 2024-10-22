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
    // Fetch user by ID, excluding the password field for security purposes
    const user = await User.findById(req.user.id)
      .select('-password') // Exclude the password field from the result to ensure security
      .lean(); // Use lean() to get a plain JavaScript object instead of a Mongoose document for better performance

    if (!user) {
      // If no user is found, return a 404 response with an appropriate message
      return res.status(404).json({ msg: 'User not found' });
    }

    // Send the user data as a JSON response
    res.json(user);
  } catch (err) {
    console.error(err.message); // Log any error message to the console for debugging
    res.status(500).send('Server error'); // Return a server error response if an unexpected error occurs
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
    // Middleware array to include authentication and validation checks
    authMiddleware,
    [
      // Validate the fields that might be updated by the user
      check('username', 'Username is required and must be alphanumeric')
        .optional() // The username field is optional during updates
        .isAlphanumeric(), // Username must contain only letters and numbers
      check('email', 'Please include a valid email')
        .optional() // The email field is optional during updates
        .isEmail(), // Validate that email, if provided, is in the correct format
      check('password', 'Password must be 6 or more characters')
        .optional() // The password field is optional during updates
        .isLength({ min: 6 }), // Password must have a minimum length of 6 characters for security purposes
    ],
  ],
  async (req, res) => {
    // Handle validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are validation errors, return them to the client as a 400 response
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      // Find the user by ID in the database
      let user = await User.findById(req.user.id);

      if (!user) {
        // If the user does not exist, return a 404 response with an appropriate message
        return res.status(404).json({ msg: 'User not found' });
      }

      // Update the username if it is provided and is different from the current username
      if (username && username !== user.username) {
        let existingUser = await User.findOne({ username });
        if (existingUser) {
          // If a different user already has the same username, return an error response
          return res.status(400).json({ msg: 'Username already in use' });
        }
        user.username = username; // Set the new username
      }

      // Update the email if it is provided and is different from the current email
      if (email && email !== user.email) {
        let existingUser = await User.findOne({ email });
        if (existingUser) {
          // If a different user already has the same email, return an error response
          return res.status(400).json({ msg: 'Email already in use' });
        }
        user.email = email; // Set the new email
        // Optionally, a flag could be set to verify the new email address
      }

      // Update the password if it is provided
      if (password) {
        const salt = await bcrypt.genSalt(10); // Generate a salt for hashing the new password
        user.password = await bcrypt.hash(password, salt); // Hash the new password before saving
      }

      // Save the updated user information to the database
      await user.save();

      // Send a success message response to indicate the update was successful
      res.json({ msg: 'Profile updated successfully' });
    } catch (err) {
      console.error(err.message); // Log any error message to the console for debugging
      res.status(500).send('Server error'); // Return a server error response if an unexpected error occurs
    }
  }
);

module.exports = router;
