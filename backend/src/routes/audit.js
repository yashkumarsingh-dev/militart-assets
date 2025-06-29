const express = require("express");
const router = express.Router();
const { getAuditLogs } = require("../middleware/logging");
const { authenticateToken } = require("../middleware/auth");
const { requireAdmin } = require("../middleware/rbac");
const {
  validateDateRange,
  validatePagination,
} = require("../middleware/validation");

// All routes require authentication and admin access
router.use(authenticateToken);
router.use(requireAdmin);

// Get audit logs (admin only)
router.get("/logs", validateDateRange, validatePagination, getAuditLogs);

module.exports = router;
