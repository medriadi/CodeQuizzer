const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from Authorization header
  const authHeader = req.header('Authorization');

  // Check if no token is provided in the Authorization header
  if (!authHeader) {
    // If the Authorization header is missing, respond with an error message and a 401 status code
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Extract the token from the Bearer scheme (e.g., "Bearer <token>")
  const token = authHeader.split(' ')[1];

  // If the token is missing after splitting the header, deny access
  if (!token) {
    // If the Bearer token is not found, respond with an error message and a 401 status code
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify the token to ensure it is valid
  try {
    // Decode the token using the secret key stored in environment variables
    // jwt.verify throws an error if the token is invalid or expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the decoded user information to the request object
    // This allows the user information to be accessed in the next middleware or route handler
    req.user = decoded.user;
    
    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // Handle specific errors such as token expiration
    if (err.name === 'TokenExpiredError') {
      // If the token has expired, respond with an error message and a 401 status code
      res.status(401).json({ msg: 'Token has expired' });
    } else {
      // Handle any other errors related to token validation, such as invalid signature
      res.status(401).json({ msg: 'Token is not valid' });
    }
  }
};
