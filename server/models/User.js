const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("./Quiz");

const AttemptSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    score: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now },
    submissionId: { type: String, maxlength: 80 },
    answersHash: { type: String, select: false },
  },
  { _id: true },
);

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: /^[a-zA-Z0-9]+$/,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: { type: String, required: true, minlength: 6, select: false },
    quizAttempts: { type: [AttemptSchema], default: [] },
  },
  { timestamps: true },
);

UserSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  return next();
});

module.exports = mongoose.model("User", UserSchema);
