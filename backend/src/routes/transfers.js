const express = require("express");
const router = express.Router();
const transferController = require("../controllers/transferController");
const { authenticateToken } = require("../middleware/auth");
const { requireLogisticsOfficer } = require("../middleware/rbac");
const {
  validateCreateTransfer,
  validateUpdateTransfer,
  validateId,
  validateAssetId,
  validateDateRange,
  validatePagination,
} = require("../middleware/validation");

// All routes require authentication
router.use(authenticateToken);

// Get all transfers (with filters)
router.get(
  "/",
  validateDateRange,
  validatePagination,
  transferController.getTransfers
);

// Get transfer by ID
router.get("/:id", validateId, transferController.getTransferById);

// Get transfer history for an asset
router.get(
  "/asset/:asset_id/history",
  validateAssetId,
  transferController.getAssetTransferHistory
);

// Create new transfer (requires logistics officer or admin)
router.post(
  "/",
  requireLogisticsOfficer,
  validateCreateTransfer,
  transferController.createTransfer
);

// Update transfer (admin only)
router.put("/:id", validateUpdateTransfer, transferController.updateTransfer);

// Delete transfer (admin only)
router.delete("/:id", validateId, transferController.deleteTransfer);

module.exports = router;
