const { Purchase, Base, Asset } = require("../models/associations");
const { Op } = require("sequelize");

// Create new purchase
const createPurchase = async (req, res) => {
  try {
    const { asset_type, asset_id, quantity, base_id, date } = req.body;
    const userRole = req.user.role;
    const userBaseId = req.user.base_id;

    // Check permissions
    if (userRole === "base_commander" && userBaseId !== base_id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Create purchase record
    const purchase = await Purchase.create({
      asset_type,
      asset_id,
      quantity,
      base_id,
      date: date || new Date(),
      status: req.body.status || "Pending",
      approved_by: req.body.approved_by || null,
      requested_by: req.body.requested_by || null,
    });

    // Create individual asset records
    const assets = [];
    for (let i = 0; i < quantity; i++) {
      const asset = await Asset.create({
        type: asset_type,
        description: `${asset_type} - Purchase ${purchase.id}`,
        serial_number: `${asset_type.toUpperCase()}-${Date.now()}-${i + 1}`,
        base_id,
        status: "available",
      });
      assets.push(asset);
    }

    // Get purchase with base details
    const purchaseWithDetails = await Purchase.findByPk(purchase.id, {
      include: [{ model: Base, as: "Base" }],
    });

    res.status(201).json({
      message: "Purchase created successfully",
      purchase: purchaseWithDetails,
      assetsCreated: assets.length,
    });
  } catch (error) {
    console.error("Create purchase error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all purchases with filters
const getPurchases = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      asset_type,
      base_id,
      page = 1,
      limit = 10,
    } = req.query;
    const userRole = req.user.role;
    const userBaseId = req.user.base_id;

    // Build where clause
    let whereClause = {};

    // Role-based filtering
    if (userRole === "base_commander" || userRole === "logistics_officer") {
      whereClause.base_id = userBaseId;
    } else if (base_id) {
      whereClause.base_id = base_id;
    }

    // Date filters
    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    // Asset type filter
    if (asset_type) {
      whereClause.asset_type = asset_type;
    }

    // Pagination
    const offset = (page - 1) * limit;

    const purchases = await Purchase.findAndCountAll({
      where: whereClause,
      include: [{ model: Base, as: "Base" }],
      order: [["date", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      purchases: purchases.rows,
      total: purchases.count,
      page: parseInt(page),
      totalPages: Math.ceil(purchases.count / limit),
    });
  } catch (error) {
    console.error("Get purchases error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get purchase by ID
const getPurchaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;
    const userBaseId = req.user.base_id;

    const purchase = await Purchase.findByPk(id, {
      include: [{ model: Base, as: "Base" }],
    });

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    // Check permissions
    if (userRole === "base_commander" && purchase.base_id !== userBaseId) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({ purchase });
  } catch (error) {
    console.error("Get purchase by ID error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update purchase
const updatePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const { asset_type, quantity, date } = req.body;
    const userRole = req.user.role;
    const userBaseId = req.user.base_id;

    const purchase = await Purchase.findByPk(id);
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    // Check permissions
    if (userRole === "base_commander" && purchase.base_id !== userBaseId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Update purchase
    await purchase.update({
      asset_type: asset_type !== undefined ? asset_type : purchase.asset_type,
      quantity: quantity !== undefined ? quantity : purchase.quantity,
      date: date !== undefined ? date : purchase.date,
      status: req.body.status !== undefined ? req.body.status : purchase.status,
      approved_by:
        req.body.approved_by !== undefined
          ? req.body.approved_by
          : purchase.approved_by,
      requested_by:
        req.body.requested_by !== undefined
          ? req.body.requested_by
          : purchase.requested_by,
    });

    // Fetch the updated purchase from the DB
    const updatedPurchase = await Purchase.findByPk(id);

    res.json({
      message: "Purchase updated successfully",
      purchase: updatedPurchase,
    });
  } catch (error) {
    console.error("Update purchase error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete purchase
const deletePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;
    const userBaseId = req.user.base_id;

    const purchase = await Purchase.findByPk(id);
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    // Check permissions
    if (userRole === "base_commander" && purchase.base_id !== userBaseId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Only admin can delete purchases
    if (userRole !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admin can delete purchases" });
    }

    await purchase.destroy();

    res.json({ message: "Purchase deleted successfully" });
  } catch (error) {
    console.error("Delete purchase error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createPurchase,
  getPurchases,
  getPurchaseById,
  updatePurchase,
  deletePurchase,
};
