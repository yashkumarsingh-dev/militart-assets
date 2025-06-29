const express = require("express");
const router = express.Router();

// Simple test route without middleware
router.get("/test", (req, res) => {
  res.json({ message: "Assignments test route works" });
});

// Test route with parameter
router.get("/:id", (req, res) => {
  res.json({ message: "Assignments ID route works", id: req.params.id });
});

module.exports = router;
