const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Cross-Origin Resource Sharing for allowing specific origins
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
      // If the request origin is not in the allowed origins list, reject it
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true); // Allow the request if the origin is valid
  },
  credentials: true, // Include credentials such as cookies in CORS requests
}));

app.use(helmet()); // Secure Express apps by setting various HTTP headers to mitigate common security risks
app.use(mongoSanitize()); // Prevent MongoDB Operator Injection by sanitizing user inputs
app.use(morgan('dev')); // Log HTTP requests for development purposes

// Rate Limiting to protect against DDoS attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Connect to MongoDB using the URI from the environment variables
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully')) // Log success message upon successful connection
  .catch((err) => console.error('MongoDB connection error:', err)); // Log error if connection fails

// Define Routes
app.get('/', (req, res) => {
  res.send('Welcome to CodeQuizzer API'); // Basic route for the root path
});

// Import and use Auth Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes); // All routes under /api/auth are handled by authRoutes

// Import and use Quiz Routes
const quizRoutes = require('./routes/quizzes');
app.use('/api/quizzes', quizRoutes); // All routes under /api/quizzes are handled by quizRoutes

// Import and use Leaderboard Routes
const leaderboardRoutes = require('./routes/leaderboard');
app.use('/api/leaderboard', leaderboardRoutes); // All routes under /api/leaderboard are handled by leaderboardRoutes

// Import and use Profile Routes
const profileRoutes = require('./routes/profile');
app.use('/api/profile', profileRoutes); // All routes under /api/profile are handled by profileRoutes

// Error Handling Middleware for JSON Parsing Errors
app.use((err, req, res, next) => {
  if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    'body' in err &&
    err.type === 'entity.parse.failed'
  ) {
    console.error('Bad JSON:', err.message); // Log the bad JSON error for debugging purposes
    return res.status(400).json({ msg: 'Invalid JSON payload' }); // Send a 400 error response for invalid JSON
  }
  next(err); // Pass other errors to the next error handler
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack); // Log any unhandled errors with the full stack trace for debugging
  res.status(500).send('Something broke!'); // Send a generic 500 error response for any unhandled server errors
});

// Start the Server
const PORT = process.env.PORT || 5000; // Use PORT from environment variables, default to 5000 if not specified
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Log the port on which the server is running
});
