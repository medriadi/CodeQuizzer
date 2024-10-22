const mongoose = require('mongoose');

// Define a schema for the Quiz collection
const QuizSchema = new mongoose.Schema({
  // Title of the quiz
  title: {
    type: String, // The title must be a string
    required: true, // The title is mandatory, every quiz must have a title
  },
  // A description of the quiz
  description: {
    type: String, // The description is a string providing additional information about the quiz
    required: false, // The description is optional, it can be provided if needed
  },
  // Array of questions associated with the quiz
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId, // Each question is referenced by its ObjectId
      ref: 'Question', // Reference to the Question model to establish a relationship between Quiz and Question
    },
  ],
  // Date when the quiz was created
  createdAt: {
    type: Date, // The date must be a valid Date object
    default: Date.now, // By default, it takes the current date and time when the quiz is created
  },
  // Additional fields like category or difficulty can be added here if needed for more specificity
});

// Export the model so it can be used in other parts of the application
// This will allow us to perform CRUD operations on the Quiz collection
module.exports = mongoose.model('Quiz', QuizSchema);
