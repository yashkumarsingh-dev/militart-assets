const { Log, User } = require("../models/associations");

// Log API transaction middleware
const logTransaction = async (req, res, next) => {
  const originalSend = res.send;

  res.send = function (data) {
    // Restore original send function
    res.send = originalSend;

    // Log the transaction
    logApiTransaction(req, res, data);

    // Call original send
    return originalSend.call(this, data);
  };

  next();
};

// Log API transaction
const logApiTransaction = async (req, res, responseData) => {
  try {
    const userId = req.user ? req.user.userId : null;
    const method = req.method;
    const url = req.originalUrl;
    const statusCode = res.statusCode;
    const requestBody = req.body;
    const requestParams = req.params;
    const requestQuery = req.query;

    // Only log if user is authenticated (except for auth endpoints)
    if (!userId && !url.includes("/auth/")) {
      return; // Skip logging for unauthenticated requests
    }

    // Determine action based on method and URL
    let action = `${method} ${url}`;

    // Map specific actions
    if (url.includes("/auth/login") && method === "POST") {
      action = "USER_LOGIN";
    } else if (url.includes("/auth/register") && method === "POST") {
      action = "USER_REGISTRATION";
    } else if (url.includes("/purchases") && method === "POST") {
      action = "CREATE_PURCHASE";
    } else if (url.includes("/purchases") && method === "PUT") {
      action = "UPDATE_PURCHASE";
    } else if (url.includes("/purchases") && method === "DELETE") {
      action = "DELETE_PURCHASE";
    } else if (url.includes("/transfers") && method === "POST") {
      action = "CREATE_TRANSFER";
    } else if (url.includes("/transfers") && method === "PUT") {
      action = "UPDATE_TRANSFER";
    } else if (url.includes("/transfers") && method === "DELETE") {
      action = "DELETE_TRANSFER";
    } else if (url.includes("/assignments") && method === "POST") {
      action = "ASSIGN_ASSET";
    } else if (url.includes("/assignments/expend") && method === "POST") {
      action = "EXPEND_ASSET";
    } else if (url.includes("/assignments") && method === "PUT") {
      action = "UPDATE_ASSIGNMENT";
    }

    // Create details object
    let safeResponseData = responseData;
    // Prevent recursive/huge logs for audit log endpoint
    if (method === "GET" && url.includes("/api/audit/logs")) {
      safeResponseData =
        typeof responseData === "string"
          ? "[audit logs omitted]"
          : JSON.stringify({ summary: "audit logs omitted" });
    } else {
      safeResponseData =
        typeof responseData === "string"
          ? responseData
          : JSON.stringify(responseData);
    }
    const details = {
      method,
      url,
      statusCode,
      requestBody:
        requestBody && Object.keys(requestBody).length > 0
          ? requestBody
          : undefined,
      requestParams:
        requestParams && Object.keys(requestParams).length > 0
          ? requestParams
          : undefined,
      requestQuery:
        requestQuery && Object.keys(requestQuery).length > 0
          ? requestQuery
          : undefined,
      responseData: safeResponseData,
      userAgent: req.get("User-Agent"),
      ipAddress:
        req.headers["x-forwarded-for"] ||
        req.ip ||
        req.connection.remoteAddress,
    };

    // Create log entry - use a default user ID for auth endpoints if no user
    const logUserId = userId || (url.includes("/auth/") ? 1 : null);

    if (logUserId) {
      await Log.create({
        user_id: logUserId,
        action,
        timestamp: new Date(),
        details: JSON.stringify(details),
        ip_address:
          req.headers["x-forwarded-for"] ||
          req.ip ||
          req.connection.remoteAddress,
      });
    }
  } catch (error) {
    console.error("Error logging transaction:", error);
    // Don't throw error to avoid breaking the response
  }
};

// Log specific actions manually
const logAction = async (userId, action, details = {}) => {
  try {
    await Log.create({
      user_id: userId,
      action,
      timestamp: new Date(),
      details: JSON.stringify(details),
      ip_address: details.ipAddress || null,
    });
  } catch (error) {
    console.error("Error logging action:", error);
  }
};

// Get audit logs with filters
const getAuditLogs = async (req, res) => {
  try {
    const {
      user_id,
      action,
      startDate,
      endDate,
      page = 1,
      limit = 50,
    } = req.query;

    const whereClause = {};

    if (user_id) {
      whereClause.user_id = user_id;
    }

    if (action) {
      whereClause.action = action;
    }

    if (startDate && endDate) {
      whereClause.timestamp = {
        [require("sequelize").Op.between]: [
          new Date(startDate),
          new Date(endDate),
        ],
      };
    }

    const offset = (page - 1) * limit;

    const logs = await Log.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "User",
          attributes: ["id", "name", "email", "role"],
        },
      ],
      order: [["timestamp", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      logs: logs.rows,
      total: logs.count,
      page: parseInt(page),
      totalPages: Math.ceil(logs.count / limit),
    });
  } catch (error) {
    console.error("Error getting audit logs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  logTransaction,
  logApiTransaction,
  logAction,
  getAuditLogs,
};
