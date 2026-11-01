const express = require('express');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const validateSubmission = [
  body('answers').isArray().withMessage('Answers must be an array'),
  body('answers.*.questionId').isMongoId().withMessage('Invalid question id'),
  body('answers.*.selectedOption').trim().notEmpty().withMessage('Every question needs an answer'),
  (req, res, next) => {
    const errors = validationResult(req);
    return errors.isEmpty() ? next() : res.status(400).json({ errors: errors.array() });
  },
];

router.get('/', async (req, res, next) => {
  try {
    const quizzes = await Quiz.find().select('title description category difficulty questions createdAt').sort({ createdAt: -1 }).lean();
    return res.json(quizzes.map((quiz) => ({ ...quiz, questionCount: quiz.questions.length })));
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', authMiddleware, async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ msg: 'Quiz not found' });
  try {
    const quiz = await Quiz.findById(req.params.id).populate({
      path: 'questions',
      select: 'questionText options',
    }).lean();
    return quiz ? res.json(quiz) : res.status(404).json({ msg: 'Quiz not found' });
  } catch (error) {
    return next(error);
  }
});

router.post('/:id/submit', authMiddleware, validateSubmission, async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ msg: 'Quiz not found' });
  try {
    const quiz = await Quiz.findById(req.params.id).populate('questions');
    if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });
    const byId = new Map(quiz.questions.map((question) => [question.id, question]));
    const answers = req.body.answers;
    const ids = answers.map((answer) => answer.questionId);
    if (ids.length !== quiz.questions.length || new Set(ids).size !== ids.length || ids.some((id) => !byId.has(id))) {
      return res.status(400).json({ msg: 'Submit exactly one answer for every quiz question' });
    }

    let score = 0;
    const results = answers.map(({ questionId, selectedOption }) => {
      const question = byId.get(questionId);
      if (!question.options.includes(selectedOption)) {
        return null;
      }
      const isCorrect = question.correctAnswer === selectedOption;
      if (isCorrect) score += 1;
      return { questionId, questionText: question.questionText, selectedOption, correctAnswer: question.correctAnswer, isCorrect, explanation: question.explanation };
    });
    if (results.some((result) => !result)) return res.status(400).json({ msg: 'An answer is not valid for this quiz' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    user.quizAttempts.push({ quizId: quiz.id, score, total: quiz.questions.length });
    await user.save();
    return res.json({ score, total: quiz.questions.length, results });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
