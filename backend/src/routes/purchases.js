const express = require("express");
const router = express.Router();
const purchaseController = require("../controllers/purchaseController");
const { authenticateToken } = require("../middleware/auth");
const { requireLogisticsOfficer } = require("../middleware/rbac");
const {
  validateCreatePurchase,
  validateUpdatePurchase,
  validateId,
  validateDateRange,
  validatePagination,
} = require("../middleware/validation");

// All routes require authentication
router.use(authenticateToken);

// Get all purchases (with filters)
router.get(
  "/",
  validateDateRange,
  validatePagination,
  purchaseController.getPurchases
);

// Get purchase by ID
router.get("/:id", validateId, purchaseController.getPurchaseById);

// Create new purchase (requires logistics officer or admin)
router.post(
  "/",
  requireLogisticsOfficer,
  validateCreatePurchase,
  purchaseController.createPurchase
);

// Update purchase (requires logistics officer or admin)
router.put(
  "/:id",
  requireLogisticsOfficer,
  validateUpdatePurchase,
  purchaseController.updatePurchase
);

// Delete purchase (admin only)
router.delete("/:id", validateId, purchaseController.deletePurchase);

module.exports = router;
