const express = require("express");
const router = express.Router();
const assetController = require("../controllers/assetController");
const baseController = require("../controllers/baseController");
const { authenticateToken } = require("../middleware/auth");
const { requireAdmin } = require("../middleware/rbac");
const {
  validateCreateAsset,
  validateUpdateAsset,
  validateId,
  validatePagination,
} = require("../middleware/validation");

// All routes require authentication
router.use(authenticateToken);

// Get all assets (with filters)
router.get("/", validatePagination, assetController.getAssets);

// Get asset by ID
router.get("/:id", validateId, assetController.getAssetById);

// Create new asset (admin only)
router.post(
  "/",
  requireAdmin,
  validateCreateAsset,
  assetController.createAsset
);

// Update asset (admin only)
router.put(
  "/:id",
  requireAdmin,
  validateUpdateAsset,
  assetController.updateAsset
);

// Delete asset (admin only)
router.delete("/:id", requireAdmin, validateId, assetController.deleteAsset);

// Get all bases
router.get("/bases", baseController.getBases);

module.exports = router;
