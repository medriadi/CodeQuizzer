const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

const router = express.Router();
const validate = (req, res, next) => {
  const errors = validationResult(req);
  return errors.isEmpty()
    ? next()
    : res
        .status(400)
        .json({ msg: errors.array()[0].msg, errors: errors.array() });
};

router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("quizAttempts.quizId", "title")
      .lean();
    return user
      ? res.json(user)
      : res.status(404).json({ msg: "User not found" });
  } catch (error) {
    return next(error);
  }
});

router.put(
  "/",
  [
    authMiddleware,
    body("username")
      .optional()
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage("Username must be 3-30 characters")
      .isAlphanumeric()
      .withMessage("Use letters and numbers only"),
    body("email")
      .optional()
      .trim()
      .isEmail()
      .withMessage("Enter a valid email")
      .normalizeEmail(),
    body("password")
      .optional({ values: "falsy" })
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    validate,
  ],
  async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ msg: "User not found" });
      const { username, email, password } = req.body;
      if (
        username &&
        username !== user.username &&
        (await User.exists({ username }))
      )
        return res.status(409).json({ msg: "Username already in use" });
      if (email && email !== user.email && (await User.exists({ email })))
        return res.status(409).json({ msg: "Email already in use" });
      if (username) user.username = username;
      if (email) user.email = email;
      if (password) user.password = password;
      await user.save();
      return res.json({
        msg: "Profile updated successfully",
        user: { id: user.id, username: user.username, email: user.email },
      });
    } catch (error) {
      if (error.code === 11000)
        return res
          .status(409)
          .json({ msg: "Email or username already in use" });
      return next(error);
    }
  },
);

module.exports = router;
