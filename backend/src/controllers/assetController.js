const { Asset, Base, Assignment, User } = require("../models/associations");
const { Op } = require("sequelize");

// Get all assets with filters
const getAssets = async (req, res) => {
  try {
    const { type, status, base_id, search, page = 1, limit = 10 } = req.query;
    const userRole = req.user.role;
    const userBaseId = req.user.base_id;

    // Build where clause
    let whereClause = {};

    // Specific filters
    if (type) {
      whereClause.type = type;
    }
    if (status) {
      whereClause.status = status;
    }
    if (base_id) {
      whereClause.base_id = base_id;
    }

    // Search filter
    if (search) {
      whereClause[Op.or] = [
        { description: { [Op.like]: `%${search}%` } },
        { serial_number: { [Op.like]: `%${search}%` } },
      ];
    }

    // Pagination
    const offset = (page - 1) * limit;

    const assets = await Asset.findAndCountAll({
      where: whereClause,
      include: [{ model: Base, as: "Base" }],
      order: [["id", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    // For each asset, find the current assignee (if any)
    const assetRows = await Promise.all(
      assets.rows.map(async (asset) => {
        const activeAssignment = await Assignment.findOne({
          where: { asset_id: asset.id, expended_date: null },
          include: [{ model: User, as: "Personnel" }],
          order: [["assigned_at", "DESC"]],
        });
        let assignedTo = "-";
        let computedStatus = "available";
        if (activeAssignment && activeAssignment.Personnel) {
          assignedTo = activeAssignment.Personnel.name;
          computedStatus = "assigned";
        }
        const assetObj = asset.toJSON();
        assetObj.status = computedStatus;
        assetObj.assignedTo = assignedTo;
        return assetObj;
      })
    );

    res.json({
      assets: assetRows,
      total: assets.count,
      page: parseInt(page),
      totalPages: Math.ceil(assets.count / limit),
    });
  } catch (error) {
    console.error("Get assets error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get asset by ID
const getAssetById = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;
    const userBaseId = req.user.base_id;

    const asset = await Asset.findByPk(id, {
      include: [{ model: Base, as: "Base" }],
    });

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    // Check permissions
    if (
      (userRole === "base_commander" || userRole === "logistics_officer") &&
      asset.base_id !== userBaseId
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({ asset });
  } catch (error) {
    console.error("Get asset by ID error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create new asset
const createAsset = async (req, res) => {
  try {
    const { name, description, type, serial_number, base_id, status, value } =
      req.body;
    const userRole = req.user.role;
    const userBaseId = req.user.base_id;

    // Check permissions (only admin can create assets)
    if (userRole !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Create asset
    const asset = await Asset.create({
      name,
      description,
      type,
      serial_number,
      base_id: base_id || userBaseId,
      status: status || "available",
      value,
    });

    // Get asset with base details
    const assetWithDetails = await Asset.findByPk(asset.id, {
      include: [{ model: Base, as: "Base" }],
    });

    res.status(201).json({
      message: "Asset created successfully",
      asset: assetWithDetails,
    });
  } catch (error) {
    console.error("Create asset error:", error);
    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      return res
        .status(400)
        .json({ message: error.message, errors: error.errors });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update asset
const updateAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, type, serial_number, base_id, status, value } =
      req.body;
    const userRole = req.user.role;
    const userBaseId = req.user.base_id;

    // Find asset
    const asset = await Asset.findByPk(id);
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    // Check permissions
    if (userRole !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Update asset
    await asset.update({
      description,
      type,
      serial_number,
      base_id,
      status,
      value,
    });

    // Get updated asset with base details
    const updatedAsset = await Asset.findByPk(id, {
      include: [{ model: Base, as: "Base" }],
    });

    res.json({
      message: "Asset updated successfully",
      asset: updatedAsset,
    });
  } catch (error) {
    console.error("Update asset error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete asset
const deleteAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    // Find asset
    const asset = await Asset.findByPk(id);
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    // Check permissions (only admin can delete assets)
    if (userRole !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Delete asset
    await asset.destroy();

    res.json({ message: "Asset deleted successfully" });
  } catch (error) {
    console.error("Delete asset error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
};
