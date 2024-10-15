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
      .select('username quizAttempts')
      .lean();

    // Calculate average percentage and number of quizzes taken for each user
    const usersWithStats = users.map((user) => {
      const totalScore = user.quizAttempts.reduce((sum, attempt) => {
        return sum + attempt.score;
      }, 0);

      const totalPossible = user.quizAttempts.reduce((sum, attempt) => {
        return sum + attempt.total;
      }, 0);

      const numQuizzes = user.quizAttempts.length;
      const averagePercentage =
        totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0;

      return {
        username: user.username,
        averagePercentage: averagePercentage.toFixed(2),
        numQuizzes: numQuizzes,
      };
    });

    // Sort users by average percentage in descending order and take top 10
    const sortedTopUsers = usersWithStats
      .sort((a, b) => b.averagePercentage - a.averagePercentage)
      .slice(0, 10);

    res.json(sortedTopUsers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
