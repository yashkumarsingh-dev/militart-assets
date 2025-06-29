const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignmentController");
const { authenticateToken } = require("../middleware/auth");
const { requireBaseCommander } = require("../middleware/rbac");
const {
  validateCreateAssignment,
  validateExpendAsset,
  validateId,
  validateAssetId,
  validatePersonnelId,
  validateDateRange,
  validatePagination,
} = require("../middleware/validation");

// All routes require authentication
router.use(authenticateToken);

// Get all assignments (with filters)
router.get(
  "/",
  validateDateRange,
  validatePagination,
  assignmentController.getAssignments
);

// Get assignment by ID
router.get("/:id", validateId, assignmentController.getAssignmentById);

// Get assignments for a specific asset
router.get(
  "/asset/:asset_id",
  validateAssetId,
  assignmentController.getAssetAssignments
);

// Get assignments for a specific personnel
router.get(
  "/personnel/:personnel_id",
  validatePersonnelId,
  assignmentController.getPersonnelAssignments
);

// Assign asset to personnel (requires base commander or admin)
router.post(
  "/",
  requireBaseCommander,
  validateCreateAssignment,
  assignmentController.assignAsset
);

// Mark asset as expended (requires base commander or admin)
router.post(
  "/expend",
  requireBaseCommander,
  validateExpendAsset,
  assignmentController.expendAsset
);

// Update assignment (admin only)
router.put("/:id", validateId, assignmentController.updateAssignment);

// Delete assignment (admin only)
router.delete("/:id", validateId, assignmentController.deleteAssignment);

module.exports = router;
