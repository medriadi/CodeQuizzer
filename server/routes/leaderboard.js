const express = require("express");
const User = require("../models/User");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const users = await User.find({ "quizAttempts.0": { $exists: true } })
      .select("username quizAttempts isDemo")
      .lean();
    const leaderboard = users
      .map((user) => {
        const totals = user.quizAttempts.reduce(
          (result, attempt) => ({
            score: result.score + attempt.score,
            total: result.total + attempt.total,
          }),
          { score: 0, total: 0 },
        );
        return {
          username: user.username,
          isDemo: user.isDemo === true,
          averagePercentage: totals.total
            ? Math.round((totals.score / totals.total) * 1000) / 10
            : 0,
          quizzesTaken: user.quizAttempts.length,
        };
      })
      .sort(
        (a, b) =>
          b.averagePercentage - a.averagePercentage ||
          b.quizzesTaken - a.quizzesTaken,
      )
      .slice(0, 10);
    return res.json(leaderboard);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
