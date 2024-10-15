const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
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
 * @desc    Get a specific quiz with its questions (without correct answers)
 * @access  Private
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate({
      path: 'questions',
      select: '-correctAnswer -explanation',
    });

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
router.post(
  '/:id/submit',
  [
    authMiddleware,
    [
      check('answers', 'Answers are required').isArray(),
      check('answers.*.questionId', 'Question ID is required').isMongoId(),
      check('answers.*.selectedOption', 'Selected option is required').notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return the array of validation errors
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const quiz = await Quiz.findById(req.params.id).populate('questions');
      if (!quiz) {
        return res.status(404).json({ msg: 'Quiz not found' });
      }

      const userAnswers = req.body.answers; // Expected format: [{ questionId, selectedOption }, ...]

      let score = 0;
      const results = [];

      // Map questions by ID for quick lookup
      const questionsMap = {};
      quiz.questions.forEach((question) => {
        questionsMap[question.id] = question;
      });

      userAnswers.forEach((answer) => {
        const question = questionsMap[answer.questionId];
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

      // Update user's quiz attempts
      const user = await User.findById(req.user.id);
      user.quizAttempts.push({
        quizId: quiz._id,
        score,
        total: quiz.questions.length,
      });
      await user.save();

      res.json({ score, total: quiz.questions.length, results });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
