const express = require('express');
const router = express.Router();
const User = require('../models/User');

/**
 * @route   GET /api/leaderboard
 * @desc    Get top 10 users with highest average percentage scores
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    // Fetch users who have at least one quiz attempt
    const users = await User.find({ 'quizAttempts.0': { $exists: true } })
      .select('username quizAttempts') // Select only username and quizAttempts fields to reduce data size
      .lean(); // Use lean() to get plain JavaScript objects instead of Mongoose documents, improving performance

    // Calculate average percentage and number of quizzes taken for each user
    const usersWithStats = users.map((user) => {
      // Calculate total score across all quiz attempts for the user
      const totalScore = user.quizAttempts.reduce((sum, attempt) => {
        return sum + attempt.score; // Accumulate the score of each attempt
      }, 0);

      // Calculate total possible score across all quiz attempts for the user
      const totalPossible = user.quizAttempts.reduce((sum, attempt) => {
        return sum + attempt.total; // Accumulate the total possible score of each attempt
      }, 0);

      // Get the number of quizzes taken by the user
      const numQuizzes = user.quizAttempts.length;

      // Calculate the average percentage score
      const averagePercentage =
        totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0; // Avoid division by zero

      return {
        username: user.username, // The user's username
        averagePercentage: averagePercentage.toFixed(2), // Format the average percentage to two decimal places
        numQuizzes: numQuizzes, // Number of quizzes taken by the user
      };
    });

    // Sort users by average percentage in descending order and take the top 10
    const sortedTopUsers = usersWithStats
      .sort((a, b) => b.averagePercentage - a.averagePercentage) // Sort users by average percentage, highest first
      .slice(0, 10); // Take the top 10 users

    // Send the sorted list of top users as the response
    res.json(sortedTopUsers);
  } catch (err) {
    console.error(err.message); // Log any server error to the console for debugging
    res.status(500).send('Server error'); // Return a server error response
  }
});

module.exports = router;

/**
 * Explanation of complex parts:
 *
 * 1. User Fetching with Conditions:
 *    - The query `{ 'quizAttempts.0': { $exists: true } }` is used to filter users who have at least one quiz attempt.
 *    - This means we only want users with non-empty `quizAttempts` arrays to be considered.
 *
 * 2. Using `.lean()`:
 *    - Using `lean()` converts Mongoose documents to plain JavaScript objects, making them faster to work with since they do not carry Mongoose overhead.
 *    - This is important for performance optimization when you do not need full Mongoose document methods.
 *
 * 3. Calculating Total Scores and Average Percentage:
 *    - `user.quizAttempts.reduce(...)` is used twice: once for summing scores (`totalScore`) and once for summing possible scores (`totalPossible`).
 *    - This approach allows for easily calculating the user's average score percentage by dividing `totalScore` by `totalPossible`.
 *    - The average percentage is then multiplied by 100 to convert it to a percentage format and formatted to two decimal places with `.toFixed(2)`.
 *
 * 4. Sorting and Selecting Top Users:
 *    - Users are sorted based on their `averagePercentage` in descending order using `sort((a, b) => b.averagePercentage - a.averagePercentage)`.
 *    - After sorting, the `.slice(0, 10)` method is used to get the top 10 users.
 */
