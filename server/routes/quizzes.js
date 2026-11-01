const crypto = require("node:crypto");
const express = require("express");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Quiz = require("../models/Quiz");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");
const { quizMetadata } = require("../lib/quizMetadata");

const router = express.Router();
const validateSubmission = [
  body("answers")
    .isArray({ min: 1, max: 200 })
    .withMessage("Answers must be a non-empty array"),
  body("answers.*.questionId").isMongoId().withMessage("Invalid question id"),
  body("answers.*.selectedOption")
    .isString()
    .notEmpty()
    .withMessage("Every question needs an answer"),
  body("submissionId")
    .optional()
    .isString()
    .isLength({ min: 8, max: 80 })
    .matches(/^[a-zA-Z0-9-]+$/)
    .withMessage("Invalid submission id"),
  (req, res, next) => {
    const errors = validationResult(req);
    return errors.isEmpty()
      ? next()
      : res
          .status(400)
          .json({ msg: errors.array()[0].msg, errors: errors.array() });
  },
];

router.get("/", async (req, res, next) => {
  try {
    const quizzes = await Quiz.find()
      .select("title description category difficulty questions createdAt")
      .sort({ createdAt: -1 })
      .lean();
    return res.json(
      quizzes.map(({ questions, ...quiz }) => ({
        ...quizMetadata(quiz),
        questionCount: questions?.length || 0,
      })),
    );
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", authMiddleware, async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(404).json({ msg: "Quiz not found" });
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate({ path: "questions", select: "questionText options" })
      .lean();
    if (!quiz) return res.status(404).json({ msg: "Quiz not found" });
    if (!quiz.questions.length || quiz.questions.some((question) => !question))
      return res
        .status(409)
        .json({
          msg: "This quiz is being updated. Please choose another challenge.",
        });
    res.set("Cache-Control", "no-store");
    return res.json(quizMetadata(quiz));
  } catch (error) {
    return next(error);
  }
});

router.post(
  "/:id/submit",
  authMiddleware,
  validateSubmission,
  async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(404).json({ msg: "Quiz not found" });
    try {
      const quiz = await Quiz.findById(req.params.id).populate("questions");
      if (!quiz) return res.status(404).json({ msg: "Quiz not found" });
      if (
        !quiz.questions.length ||
        quiz.questions.some((question) => !question)
      )
        return res
          .status(409)
          .json({
            msg: "This quiz is being updated. Please choose another challenge.",
          });
      const byId = new Map(
        quiz.questions.map((question) => [question.id, question]),
      );
      const { answers, submissionId } = req.body;
      const ids = answers.map((answer) => answer.questionId);
      if (
        ids.length !== quiz.questions.length ||
        new Set(ids).size !== ids.length ||
        ids.some((id) => !byId.has(id))
      ) {
        return res
          .status(400)
          .json({ msg: "Submit exactly one answer for every quiz question" });
      }
      let score = 0;
      const results = answers.map(({ questionId, selectedOption }) => {
        const question = byId.get(questionId);
        if (!question.options.includes(selectedOption)) return null;
        const isCorrect = question.correctAnswer === selectedOption;
        if (isCorrect) score += 1;
        return {
          questionId,
          questionText: question.questionText,
          selectedOption,
          correctAnswer: question.correctAnswer,
          isCorrect,
          explanation: question.explanation,
        };
      });
      if (results.some((result) => !result))
        return res
          .status(400)
          .json({ msg: "An answer is not valid for this quiz" });
      const total = quiz.questions.length;
      const answersHash = crypto
        .createHash("sha256")
        .update(
          JSON.stringify([
            quiz.id,
            answers
              .slice()
              .sort((a, b) => a.questionId.localeCompare(b.questionId)),
          ]),
        )
        .digest("hex");
      const filter = { _id: req.user.id };
      if (submissionId)
        filter["quizAttempts.submissionId"] = { $ne: submissionId };
      // Atomic append avoids lost attempts during simultaneous submissions. A client
      // retry with the same ID must not add a second attempt after a lost response.
      const saved = await User.updateOne(
        filter,
        {
          $push: {
            quizAttempts: {
              quizId: quiz.id,
              score,
              total,
              ...(submissionId ? { submissionId, answersHash } : {}),
            },
          },
        },
        { runValidators: true },
      );
      if (!saved.matchedCount) {
        const user = await User.findById(req.user.id)
          .select("+quizAttempts.answersHash")
          .lean();
        if (!user) return res.status(404).json({ msg: "User not found" });
        const attempt = user.quizAttempts.find(
          (item) => item.submissionId === submissionId,
        );
        if (
          !attempt ||
          attempt.answersHash !== answersHash ||
          attempt.score !== score ||
          attempt.total !== total
        )
          return res
            .status(409)
            .json({
              msg: "This attempt has already been submitted. Start a new challenge from the library.",
            });
      }
      res.set("Cache-Control", "no-store");
      return res.json({
        score,
        total,
        percentage: Math.round((score / total) * 100),
        results,
      });
    } catch (error) {
      return next(error);
    }
  },
);
module.exports = router;
