const express = require('express');
const router = express.Router();
const User = require('../models/User');

/**
 * @route   GET /api/leaderboard
 * @desc    Get top 10 users with highest scores
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const topUsers = await User.find({ scores: { $exists: true, $ne: [] } })
      .select('username scores')
      .lean();

    // Map users to include their highest score
    const usersWithHighestScores = topUsers.map((user) => ({
      username: user.username,
      highestScore: Math.max(...user.scores),
    }));

    // Sort users by highestScore in descending order and get top 10
    const sortedTopUsers = usersWithHighestScores
      .sort((a, b) => b.highestScore - a.highestScore)
      .slice(0, 10);

    res.json(sortedTopUsers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
