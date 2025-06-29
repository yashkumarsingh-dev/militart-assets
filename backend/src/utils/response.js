// Standardized API response utilities

// Success response
const successResponse = (res, data, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// Error response
const errorResponse = (
  res,
  message = "Error occurred",
  statusCode = 500,
  errors = null
) => {
  const response = {
    success: false,
    message,
    statusCode,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

// Pagination response
const paginatedResponse = (
  res,
  data,
  total,
  page,
  limit,
  message = "Success"
) => {
  return res.json({
    success: true,
    message,
    data,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  });
};

// Validation error response
const validationErrorResponse = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: "Validation failed",
    errors: errors.array(),
  });
};

// Not found response
const notFoundResponse = (res, message = "Resource not found") => {
  return res.status(404).json({
    success: false,
    message,
  });
};

// Unauthorized response
const unauthorizedResponse = (res, message = "Unauthorized") => {
  return res.status(401).json({
    success: false,
    message,
  });
};

// Forbidden response
const forbiddenResponse = (res, message = "Access denied") => {
  return res.status(403).json({
    success: false,
    message,
  });
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
  validationErrorResponse,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
};
