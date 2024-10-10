const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Additional fields like category or difficulty can be added here
});

module.exports = mongoose.model('Quiz', QuizSchema);
