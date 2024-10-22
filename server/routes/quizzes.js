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
    // Fetch all quizzes and select only specific fields to reduce response size
    const quizzes = await Quiz.find().select('title description');
    res.json(quizzes); // Return the list of quizzes to the client
  } catch (err) {
    console.error(err.message); // Log any error message for debugging purposes
    res.status(500).send('Server error'); // Send a generic server error response if something goes wrong
  }
});

/**
 * @route   GET /api/quizzes/:id
 * @desc    Get a specific quiz with its questions (without correct answers)
 * @access  Private
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    // Fetch a specific quiz by ID and populate its questions, excluding correct answers and explanations
    const quiz = await Quiz.findById(req.params.id).populate({
      path: 'questions',
      select: '-correctAnswer -explanation', // Exclude fields to prevent exposing answers
    });

    if (!quiz) {
      // If the quiz is not found, return a 404 response with an appropriate message
      return res.status(404).json({ msg: 'Quiz not found' });
    }

    res.json(quiz); // Return the quiz data to the client
  } catch (err) {
    console.error(err.message); // Log any error message for debugging purposes
    if (err.kind === 'ObjectId') {
      // If the provided ID is not a valid ObjectId, return a 404 response
      return res.status(404).json({ msg: 'Quiz not found' });
    }
    res.status(500).send('Server error'); // Send a generic server error response if something goes wrong
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
    authMiddleware, // Ensure the user is authenticated before allowing quiz submission
    [
      // Validate that answers array is provided
      check('answers', 'Answers are required').isArray(),
      // Validate that each answer includes a valid MongoDB ObjectId for the question
      check('answers.*.questionId', 'Question ID is required').isMongoId(),
      // Validate that each answer includes a selected option
      check('answers.*.selectedOption', 'Selected option is required').notEmpty(),
    ],
  ],
  async (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If validation fails, return the array of errors to the client
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Fetch the quiz by ID and populate its questions
      const quiz = await Quiz.findById(req.params.id).populate('questions');
      if (!quiz) {
        // If the quiz is not found, return a 404 response
        return res.status(404).json({ msg: 'Quiz not found' });
      }

      const userAnswers = req.body.answers; // Expected format: [{ questionId, selectedOption }, ...]

      let score = 0; // Initialize the user's score
      const results = []; // Array to store detailed results for each question

      // Map questions by their ID for quick lookup
      const questionsMap = {};
      quiz.questions.forEach((question) => {
        questionsMap[question.id] = question; // Store each question using its ID as the key
      });

      // Iterate through user answers to evaluate correctness
      userAnswers.forEach((answer) => {
        const question = questionsMap[answer.questionId]; // Get the question by ID from the map
        if (question) {
          const isCorrect = question.correctAnswer === answer.selectedOption; // Check if the selected option matches the correct answer
          if (isCorrect) score += 1; // Increment the score if the answer is correct
          // Push the result for each question, including relevant details
          results.push({
            questionId: question.id, // The ID of the question
            questionText: question.questionText, // The text of the question
            selectedOption: answer.selectedOption, // The option selected by the user
            correctAnswer: question.correctAnswer, // The correct answer for the question
            isCorrect, // Boolean indicating whether the answer was correct
            explanation: question.explanation, // Include explanation for each question
          });
        }
      });

      // Update the user's quiz attempts with the latest quiz attempt
      const user = await User.findById(req.user.id);
      user.quizAttempts.push({
        quizId: quiz._id, // Reference the quiz ID
        score, // User's score in this quiz
        total: quiz.questions.length, // Total number of questions in the quiz
      });
      await user.save(); // Save the updated user data

      // Send the score, total number of questions, and detailed results as response
      res.json({ score, total: quiz.questions.length, results });
    } catch (err) {
      console.error(err.message); // Log any error message for debugging purposes
      res.status(500).send('Server error'); // Send a generic server error response if something goes wrong
    }
  }
);

module.exports = router;
