const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const Quiz = require('./models/Quiz');
const Question = require('./models/Question');

const quizzes = [
  {
    title: 'JavaScript Basics',
    description: 'Test your knowledge on basic JavaScript concepts.',
    questions: [
      {
        questionText: 'What is the output of `typeof null` in JavaScript?',
        options: ['"null"', '"object"', '"undefined"', '"number"'],
        correctAnswer: '"object"',
        explanation: 'In JavaScript, typeof null returns "object". This is a long-standing bug in the language.',
      },
      {
        questionText: 'Which company developed JavaScript?',
        options: ['Microsoft', 'Google', 'Netscape', 'Apple'],
        correctAnswer: 'Netscape',
        explanation: 'JavaScript was developed by Netscape Communications.',
      },
      // Add more questions as needed
    ],
  },
  {
    title: 'Python Fundamentals',
    description: 'Assess your understanding of fundamental Python programming.',
    questions: [
      {
        questionText: 'What is the output of `print(2 ** 3)` in Python?',
        options: ['5', '6', '8', '9'],
        correctAnswer: '8',
        explanation: '`**` is the exponentiation operator in Python. 2 ** 3 equals 8.',
      },
      {
        questionText: 'Which keyword is used to define a function in Python?',
        options: ['func', 'define', 'def', 'function'],
        correctAnswer: 'def',
        explanation: 'The `def` keyword is used to define functions in Python.',
      },
      // Add more questions as needed
    ],
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding');

    // Clear existing data
    await Quiz.deleteMany({});
    await Question.deleteMany({});
    console.log('Existing quizzes and questions removed');

    for (const quizData of quizzes) {
      const { title, description, questions } = quizData;
      const questionIds = [];

      for (const questionData of questions) {
        const question = new Question(questionData);
        await question.save();
        questionIds.push(question._id);
      }

      const quiz = new Quiz({
        title,
        description,
        questions: questionIds,
      });

      await quiz.save();
      console.log(`Quiz "${title}" created`);
    }

    console.log('Database seeding completed');
    process.exit();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();
