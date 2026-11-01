const mongoose = require("mongoose");
// Populate resolves refs through the model registry, including on a fresh process.
require("./Question");

const QuizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 500, default: "" },
    category: { type: String, trim: true, default: "Programming" },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    questions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Quiz", QuizSchema);
