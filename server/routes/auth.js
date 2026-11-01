const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

const router = express.Router();
const credentials = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Enter a valid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];
const validate = (req, res, next) => {
  const errors = validationResult(req);
  return errors.isEmpty()
    ? next()
    : res
        .status(400)
        .json({ msg: errors.array()[0].msg, errors: errors.array() });
};
const tokenFor = (user) =>
  jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

router.post(
  "/register",
  [
    body("username")
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage("Username must be 3-30 characters")
      .isAlphanumeric()
      .withMessage("Username must be alphanumeric"),
    ...credentials,
    validate,
  ],
  async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const existing = await User.findOne({ $or: [{ email }, { username }] });
      if (existing)
        return res
          .status(409)
          .json({ msg: "Email or username already exists" });
      const user = await User.create({ username, email, password });
      return res.status(201).json({ token: tokenFor(user) });
    } catch (error) {
      return next(error);
    }
  },
);

router.post("/login", [...credentials, validate], async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select(
      "+password",
    );
    if (
      !user ||
      user.isDemo ||
      !(await bcrypt.compare(req.body.password, user.password))
    ) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }
    return res.json({ token: tokenFor(user) });
  } catch (error) {
    return next(error);
  }
});

router.get("/user", authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password").lean();
    return user
      ? res.json(user)
      : res.status(404).json({ msg: "User not found" });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
