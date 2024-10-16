const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Ensure 'cors' is required only once
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Set 'trust proxy' to trust the first proxy (useful if behind a proxy like Render)
app.set('trust proxy', 1);

// Middleware
app.use(express.json()); // Parses incoming requests with JSON payloads

// Allow Multiple Origins
const allowedOrigins = ['http://localhost:3000', 'https://codequizzer.onrender.com'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(helmet()); // Secure your Express apps by setting various HTTP headers
app.use(mongoSanitize()); // Prevent MongoDB Operator Injection
app.use(morgan('dev')); // HTTP request logger

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define Routes
app.get('/', (req, res) => {
  res.send('Welcome to CodeQuizzer API');
});

// Import and use Auth Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Import and use Quiz Routes
const quizRoutes = require('./routes/quizzes');
app.use('/api/quizzes', quizRoutes);

// Import and use Leaderboard Routes
const leaderboardRoutes = require('./routes/leaderboard');
app.use('/api/leaderboard', leaderboardRoutes);

// Import and use Profile Routes
const profileRoutes = require('./routes/profile');
app.use('/api/profile', profileRoutes);

// Error Handling Middleware for JSON Parsing Errors
app.use((err, req, res, next) => {
  if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    'body' in err &&
    err.type === 'entity.parse.failed'
  ) {
    console.error('Bad JSON:', err.message);
    return res.status(400).json({ msg: 'Invalid JSON payload' });
  }
  next(err);
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).send('Something broke!');
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
