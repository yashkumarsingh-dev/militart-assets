const { body, param, query, validationResult } = require("express-validator");

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

// Authentication validation
const validateLogin = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  handleValidationErrors,
];

const validateRegister = [
  body("name")
    .optional()
    .notEmpty()
    .withMessage("Name is required if firstName/lastName not provided"),
  body("firstName")
    .optional()
    .notEmpty()
    .withMessage("First name is required if name not provided"),
  body("lastName")
    .optional()
    .notEmpty()
    .withMessage("Last name is required if name not provided"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .isIn(["admin", "base_commander", "logistics_officer"])
    .withMessage("Invalid role"),
  body("base_id").optional().isInt().withMessage("Base ID must be an integer"),
  // Custom validation to ensure either name or firstName+lastName is provided
  (req, res, next) => {
    const { name, firstName, lastName } = req.body;
    if (!name && (!firstName || !lastName)) {
      return res.status(400).json({
        message:
          "Either 'name' or both 'firstName' and 'lastName' are required",
      });
    }
    next();
  },
  handleValidationErrors,
];

// Purchase validation
const validateCreatePurchase = [
  body("asset_type").notEmpty().withMessage("Asset type is required"),
  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
  body("base_id").isInt().withMessage("Base ID must be an integer"),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO date"),
  handleValidationErrors,
];

const validateUpdatePurchase = [
  param("id").isInt().withMessage("Purchase ID must be an integer"),
  body("asset_type")
    .optional()
    .notEmpty()
    .withMessage("Asset type cannot be empty"),
  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO date"),
  handleValidationErrors,
];

// Transfer validation
const validateCreateTransfer = [
  body("asset_id").isInt().withMessage("Asset ID must be an integer"),
  body("from_base_id").isInt().withMessage("From base ID must be an integer"),
  body("to_base_id").isInt().withMessage("To base ID must be an integer"),
  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO date"),
  handleValidationErrors,
];

const validateUpdateTransfer = [
  param("id").isInt().withMessage("Transfer ID must be an integer"),
  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO date"),
  handleValidationErrors,
];

// Assignment validation
const validateCreateAssignment = [
  body("asset_id").isInt().withMessage("Asset ID must be an integer"),
  body("personnel_id").isInt().withMessage("Personnel ID must be an integer"),
  body("assigned_date")
    .optional()
    .isISO8601()
    .withMessage("Assigned date must be a valid ISO date"),
  handleValidationErrors,
];

const validateExpendAsset = [
  body("assignment_id").isInt().withMessage("Assignment ID must be an integer"),
  body("expended_date")
    .optional()
    .isISO8601()
    .withMessage("Expended date must be a valid ISO date"),
  handleValidationErrors,
];

// Query parameter validation
const validateDateRange = [
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO date"),
  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO date"),
  handleValidationErrors,
];

const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  handleValidationErrors,
];

// ID parameter validation
const validateId = [
  param("id").isInt().withMessage("ID must be an integer"),
  handleValidationErrors,
];

const validateAssetId = [
  param("asset_id").isInt().withMessage("Asset ID must be an integer"),
  handleValidationErrors,
];

const validatePersonnelId = [
  param("personnel_id").isInt().withMessage("Personnel ID must be an integer"),
  handleValidationErrors,
];

// Asset validation
const validateCreateAsset = [
  body("description").notEmpty().withMessage("Description is required"),
  body("type").notEmpty().withMessage("Type is required"),
  body("serial_number")
    .optional()
    .notEmpty()
    .withMessage("Serial number cannot be empty"),
  body("base_id").optional().isInt().withMessage("Base ID must be an integer"),
  body("status")
    .optional()
    .isIn(["available", "assigned", "maintenance", "retired"])
    .withMessage("Invalid status"),
  body("value").optional().notEmpty().withMessage("Value cannot be empty"),
  handleValidationErrors,
];

const validateUpdateAsset = [
  param("id").isInt().withMessage("Asset ID must be an integer"),
  body("description")
    .optional()
    .notEmpty()
    .withMessage("Description cannot be empty"),
  body("type").optional().notEmpty().withMessage("Type cannot be empty"),
  body("serial_number")
    .optional()
    .notEmpty()
    .withMessage("Serial number cannot be empty"),
  body("base_id").optional().isInt().withMessage("Base ID must be an integer"),
  body("status")
    .optional()
    .isIn(["available", "assigned", "maintenance", "retired"])
    .withMessage("Invalid status"),
  body("value").optional().notEmpty().withMessage("Value cannot be empty"),
  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  validateLogin,
  validateRegister,
  validateCreatePurchase,
  validateUpdatePurchase,
  validateCreateTransfer,
  validateUpdateTransfer,
  validateCreateAssignment,
  validateExpendAsset,
  validateDateRange,
  validatePagination,
  validateId,
  validateAssetId,
  validatePersonnelId,
  validateCreateAsset,
  validateUpdateAsset,
};
