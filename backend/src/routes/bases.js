const express = require("express");
const router = express.Router();
const baseController = require("../controllers/baseController");
const { authenticateToken } = require("../middleware/auth");

// All routes require authentication
router.use(authenticateToken);

// Get all bases
router.get("/", baseController.getBases);

module.exports = router;
