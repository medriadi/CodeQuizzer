const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

// Define a schema for quiz attempts made by users
const QuizAttemptSchema = new mongoose.Schema({
  // Reference to the specific quiz attempted
  quizId: {
    type: mongoose.Schema.Types.ObjectId, // The quizId is an ObjectId that references the Quiz model
    ref: 'Quiz', // Establishes a relationship between QuizAttempt and Quiz
    required: true, // quizId is required to know which quiz was attempted
  },
  // The score obtained by the user in the quiz
  score: {
    type: Number, // The score must be a number
    required: true, // Score is mandatory for tracking user performance
  },
  // The total possible score for the quiz
  total: {
    type: Number, // Total possible score must be a number
    required: true, // Total score is mandatory to compare user performance
  },
  // The date when the quiz was attempted
  date: {
    type: Date, // Date object to track when the attempt was made
    default: Date.now, // Default value is the current date and time
  },
});

// Define a schema for users
const UserSchema = new mongoose.Schema({
  // Username of the user
  username: {
    type: String, // The username must be a string
    required: true, // Username is required for unique identification
    unique: true, // Username must be unique for each user
    trim: true, // Trims whitespace from the beginning and end of the username
    minlength: 3, // Minimum length of 3 characters for the username
    maxlength: 30, // Maximum length of 30 characters for the username
    validate: [validator.isAlphanumeric, 'Username must be alphanumeric'], // Validates that the username only contains letters and numbers
  },
  // Email address of the user
  email: {
    type: String, // The email must be a string
    required: true, // Email is required for account communication
    unique: true, // Email must be unique to avoid duplicate accounts
    trim: true, // Trims whitespace from the beginning and end of the email
    lowercase: true, // Converts the email to lowercase for consistency
    validate: [validator.isEmail, 'Invalid email address'], // Validates that the email is in a proper format
  },
  // Password for the user account
  password: {
    type: String, // The password must be a string
    required: true, // Password is required to secure the user account
    minlength: 6, // Minimum length of 6 characters for security purposes
  },
  // Array of quiz attempts made by the user
  quizAttempts: [QuizAttemptSchema], // Embeds QuizAttempt schema for storing attempts made by the user
  // Date when the user was created
  date: {
    type: Date, // Date object to track when the user was created
    default: Date.now, // Default value is the current date and time
  },
});

// Middleware to hash the user's password before saving it to the database
UserSchema.pre('save', async function (next) {
  // If the password field has not been modified, skip hashing
  if (!this.isModified('password')) return next();
  try {
    // Generate a salt to use in hashing the password
    const salt = await bcrypt.genSalt(10); // bcrypt.genSalt generates a random salt with 10 rounds
    // Hash the password with the generated salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password to enhance security
    next(); // Continue to the next middleware or save operation
  } catch (err) {
    next(err); // Pass any error to the next middleware for proper handling
  }
});

// Export the User model to be used in other parts of the application
// This allows interaction with the User collection in the database, including CRUD operations
module.exports = mongoose.model('User', UserSchema);
