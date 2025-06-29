// System constants and enums

// User roles
const USER_ROLES = {
  ADMIN: "admin",
  BASE_COMMANDER: "base_commander",
  LOGISTICS_OFFICER: "logistics_officer",
};

// Asset statuses
const ASSET_STATUS = {
  AVAILABLE: "available",
  ASSIGNED: "assigned",
  EXPENDED: "expended",
  MAINTENANCE: "maintenance",
  RETIRED: "retired",
};

// Asset types
const ASSET_TYPES = {
  WEAPON: "weapon",
  VEHICLE: "vehicle",
  AMMUNITION: "ammunition",
  EQUIPMENT: "equipment",
  COMMUNICATION: "communication",
  MEDICAL: "medical",
};

// Assignment statuses
const ASSIGNMENT_STATUS = {
  ACTIVE: "active",
  EXPENDED: "expended",
};

// API actions for logging
const API_ACTIONS = {
  // Authentication
  USER_LOGIN: "USER_LOGIN",
  USER_REGISTRATION: "USER_REGISTRATION",
  USER_LOGOUT: "USER_LOGOUT",

  // Purchases
  CREATE_PURCHASE: "CREATE_PURCHASE",
  UPDATE_PURCHASE: "UPDATE_PURCHASE",
  DELETE_PURCHASE: "DELETE_PURCHASE",
  VIEW_PURCHASE: "VIEW_PURCHASE",

  // Transfers
  CREATE_TRANSFER: "CREATE_TRANSFER",
  UPDATE_TRANSFER: "UPDATE_TRANSFER",
  DELETE_TRANSFER: "DELETE_TRANSFER",
  VIEW_TRANSFER: "VIEW_TRANSFER",

  // Assignments
  ASSIGN_ASSET: "ASSIGN_ASSET",
  EXPEND_ASSET: "EXPEND_ASSET",
  UPDATE_ASSIGNMENT: "UPDATE_ASSIGNMENT",
  VIEW_ASSIGNMENT: "VIEW_ASSIGNMENT",

  // Dashboard
  VIEW_DASHBOARD: "VIEW_DASHBOARD",
  VIEW_METRICS: "VIEW_METRICS",

  // Audit
  VIEW_AUDIT_LOGS: "VIEW_AUDIT_LOGS",
};

// HTTP status codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};

// Pagination defaults
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Date formats
const DATE_FORMATS = {
  ISO: "YYYY-MM-DDTHH:mm:ss.SSSZ",
  DATE_ONLY: "YYYY-MM-DD",
  TIME_ONLY: "HH:mm:ss",
};

// File upload limits
const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ["image/jpeg", "image/png", "application/pdf"],
};

// JWT configuration
const JWT_CONFIG = {
  EXPIRES_IN: "24h",
  REFRESH_EXPIRES_IN: "7d",
};

// Database configuration
const DB_CONFIG = {
  POOL_MAX: 5,
  POOL_MIN: 0,
  POOL_ACQUIRE: 30000,
  POOL_IDLE: 10000,
};

module.exports = {
  USER_ROLES,
  ASSET_STATUS,
  ASSET_TYPES,
  ASSIGNMENT_STATUS,
  API_ACTIONS,
  HTTP_STATUS,
  PAGINATION,
  DATE_FORMATS,
  UPLOAD_LIMITS,
  JWT_CONFIG,
  DB_CONFIG,
};
