const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const morgan = require("morgan");

dotenv.config();

const app = express();
app.set("trust proxy", 1);
app.use(express.json({ limit: "100kb" }));

const allowedOrigins = (
  process.env.ALLOWED_ORIGINS ||
  "http://localhost:3000,https://codequizzer.onrender.com"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      const error = new Error("Origin is not allowed by CORS");
      error.status = 403;
      return callback(error);
    },
    credentials: true,
  }),
);
app.use(helmet());
app.use(mongoSanitize());
app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev", {
    skip: () => process.env.NODE_ENV === "test",
  }),
);
app.get("/healthz", (req, res) => {
  const ready = mongoose.connection.readyState === 1;
  res
    .set("Cache-Control", "no-store")
    .status(ready ? 200 : 503)
    .json({ status: ready ? "ok" : "unavailable" });
});
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 600,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
      msg: "Too many requests. Please wait a few minutes and try again.",
    },
  }),
);
app.use("/api", (req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});
app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    skipSuccessfulRequests: true,
    skip: (req) => req.method !== "POST",
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
      msg: "Too many sign-in attempts. Please wait 15 minutes and try again.",
    },
  }),
);

app.get("/", (req, res) => {
  res.json({ name: "CodeQuizzer API", status: "ok" });
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/quizzes", require("./routes/quizzes"));
app.use("/api/leaderboard", require("./routes/leaderboard"));
app.use("/api/profile", require("./routes/profile"));

app.use((req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    err.type === "entity.parse.failed"
  ) {
    return res.status(400).json({ msg: "Invalid JSON payload" });
  }
  if (err.status === 403) return res.status(403).json({ msg: err.message });
  if (err.type === "entity.too.large")
    return res.status(413).json({ msg: "Request is too large" });
  if (err.code === 11000)
    return res.status(409).json({ msg: "Email or username already exists" });
  if (err.name === "ValidationError")
    return res
      .status(400)
      .json({ msg: Object.values(err.errors)[0]?.message || "Invalid data" });
  if (mongoose.connection.readyState !== 1 && /Mongo|Mongoose/.test(err.name))
    return res
      .status(503)
      .json({
        msg: "The database is temporarily unavailable. Please try again shortly.",
      });
  console.error("Unhandled error:", err);
  return res.status(500).json({ msg: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
    throw new Error("MONGODB_URI and JWT_SECRET must be configured");
  }
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log("MongoDB connected successfully");
  return app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

if (require.main === module) {
  startServer().catch((err) => {
    console.error("Server startup failed:", err.message);
    process.exitCode = 1;
  });
}

module.exports = { app, startServer };
