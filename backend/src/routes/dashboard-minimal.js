const express = require("express");
const router = express.Router();

// Simple test route without middleware
router.get("/test", (req, res) => {
  res.json({ message: "Dashboard test route works" });
});

// Test route with simple middleware
router.get("/metrics", (req, res) => {
  res.json({ message: "Dashboard metrics route works" });
});

module.exports = router;
