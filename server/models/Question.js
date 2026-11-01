const mongoose = require('mongoose');

// Define a schema for the Question collection
const QuestionSchema = new mongoose.Schema({
  // The text of the question
  questionText: {
    type: String, // The question must be a string
    required: true, // The question text is mandatory, it cannot be null or undefined
    trim: true,
  },
  // The possible options for answering the question
  options: {
    type: [String], // An array containing possible answer strings, each being of type String
    required: true, // The options array is mandatory, meaning the question must have options
    // Custom validation to ensure there are exactly 4 options
    validate: [
      { validator: arrayLimit, message: '{PATH} must have exactly 4 options' },
      { validator: (options) => new Set(options).size === options.length, message: '{PATH} must contain unique options' },
    ],
  },
  // The correct answer for the question
  correctAnswer: {
    type: String, // The correct answer must be a string matching one of the options
    required: true, // The correct answer is mandatory, it cannot be null or undefined
    validate: {
      validator: function (answer) {
        return this.options.includes(answer);
      },
      message: 'Correct answer must match one of the options',
    },
  },
  // An optional explanation for the correct answer
  explanation: {
    type: String, // The explanation must be a string if provided, used for elaboration
    required: false, // The explanation is not mandatory, it provides additional context if available
  },
});

// Custom validator function to ensure the options array contains exactly 4 elements
function arrayLimit(val) {
  return val.length === 4; // Returns true if there are exactly 4 options, ensuring consistency across questions
}

// Export the model so it can be used in other parts of the application
// This will allow us to perform CRUD operations on the Question collection
module.exports = mongoose.model('Question', QuestionSchema);
