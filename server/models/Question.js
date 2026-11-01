const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true, trim: true, maxlength: 500 },
  options: {
    type: [String],
    required: true,
    validate: [
      { validator: (options) => options.length === 4, message: 'A question must have exactly four options' },
      { validator: (options) => new Set(options).size === options.length, message: 'Question options must be unique' },
    ],
  },
  correctAnswer: {
    type: String,
    required: true,
    validate: {
      validator(answer) {
        return Array.isArray(this.options) && this.options.includes(answer);
      },
      message: 'The correct answer must be one of the options',
    },
  },
  explanation: { type: String, trim: true, maxlength: 1000 },
});

module.exports = mongoose.model('Question', QuestionSchema);
