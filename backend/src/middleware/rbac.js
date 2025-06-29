// Role-based access control middleware

// Check if user has admin role
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
};

// Check if user has base commander role
const requireBaseCommander = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (req.user.role !== "admin" && req.user.role !== "base_commander") {
    return res.status(403).json({ message: "Base commander access required" });
  }

  next();
};

// Check if user has logistics officer role
const requireLogisticsOfficer = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (
    req.user.role !== "admin" &&
    req.user.role !== "base_commander" &&
    req.user.role !== "logistics_officer"
  ) {
    return res
      .status(403)
      .json({ message: "Logistics officer access required" });
  }

  next();
};

// Check if user can access specific base
const requireBaseAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const baseId = req.params.base_id || req.body.base_id || req.query.base_id;

  if (!baseId) {
    return next(); // No base specified, continue
  }

  // Admin can access all bases
  if (req.user.role === "admin") {
    return next();
  }

  // Base commander and logistics officer can only access their assigned base
  if (req.user.base_id && req.user.base_id.toString() === baseId.toString()) {
    return next();
  }

  return res.status(403).json({ message: "Access denied to this base" });
};

// Check if user can access specific asset
const requireAssetAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  // Admin can access all assets
  if (req.user.role === "admin") {
    return next();
  }

  // For base commander and logistics officer, we'll check asset access in the controller
  // since we need to query the database to get the asset's base_id
  next();
};

// Check if user can access specific user/personnel
const requireUserAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const userId =
    req.params.user_id || req.params.personnel_id || req.body.personnel_id;

  if (!userId) {
    return next(); // No user specified, continue
  }

  // Admin can access all users
  if (req.user.role === "admin") {
    return next();
  }

  // Users can access their own data
  if (req.user.userId && req.user.userId.toString() === userId.toString()) {
    return next();
  }

  // Base commander and logistics officer can access users in their base
  // This will be checked in the controller since we need to query the database
  next();
};

module.exports = {
  requireAdmin,
  requireBaseCommander,
  requireLogisticsOfficer,
  requireBaseAccess,
  requireAssetAccess,
  requireUserAccess,
};
