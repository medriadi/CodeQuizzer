const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const User = require('../models/User');

/**
 * @route   GET /api/quizzes
 * @desc    Get all available quizzes
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find().select('title description');
    res.json(quizzes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route   GET /api/quizzes/:id
 * @desc    Get a specific quiz with its questions
 * @access  Private
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('questions');
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Quiz not found' });
    }
    res.status(500).send('Server error');
  }
});

/**
 * @route   POST /api/quizzes/:id/submit
 * @desc    Submit quiz answers and calculate score
 * @access  Private
 */
router.post('/:id/submit', authMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('questions');
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

    const userAnswers = req.body.answers; // Expected format: [{ questionId, selectedOption }, ...]

    if (!userAnswers || !Array.isArray(userAnswers)) {
      return res.status(400).json({ msg: 'Invalid answers format' });
    }

    let score = 0;
    const results = [];

    userAnswers.forEach((answer) => {
      const question = quiz.questions.find((q) => q.id === answer.questionId);
      if (question) {
        const isCorrect = question.correctAnswer === answer.selectedOption;
        if (isCorrect) score += 1;
        results.push({
          questionId: question.id,
          questionText: question.questionText,
          selectedOption: answer.selectedOption,
          correctAnswer: question.correctAnswer,
          isCorrect,
          explanation: question.explanation,
        });
      }
    });

    // Update user's scores
    const user = await User.findById(req.user.id);
    user.scores.push(score);
    await user.save();

    res.json({ score, total: quiz.questions.length, results });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
