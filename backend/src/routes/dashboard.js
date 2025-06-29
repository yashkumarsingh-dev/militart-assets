const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { authenticateToken } = require("../middleware/auth");
const {
  validateDateRange,
  validatePagination,
} = require("../middleware/validation");

// All routes require authentication
router.use(authenticateToken);

// Get dashboard metrics
router.get(
  "/metrics",
  validateDateRange,
  dashboardController.getDashboardMetrics
);

// Get detailed net movement breakdown
router.get(
  "/net-movement",
  validateDateRange,
  dashboardController.getNetMovementDetails
);

module.exports = router;
