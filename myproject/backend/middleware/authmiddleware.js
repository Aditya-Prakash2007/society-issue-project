// Example auth middleware - just checks if authorization header exists
module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized, token missing' });
  }
  // Optionally verify token here

  next();
};
