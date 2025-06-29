const jwt = require("jsonwebtoken");

// Verify JWT token middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  // console.log("Auth header:", authHeader);
  // console.log("Token:", token);

  if (!token) {
    // console.log("No token provided");
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // console.log("JWT verification error:", err);
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    // console.log("Authenticated user:", user);
    next();
  });
};

// Optional authentication middleware (for public routes)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (!err) {
        req.user = user;
      }
      next();
    });
  } else {
    next();
  }
};

module.exports = {
  authenticateToken,
  optionalAuth,
};
