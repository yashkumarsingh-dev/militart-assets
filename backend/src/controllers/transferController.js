const { Transfer, Asset, Base } = require("../models/associations");
const { sequelize } = require("../models/index");
const { Op } = require("sequelize");

// Create new transfer
const createTransfer = async (req, res) => {
  try {
    const { asset_id, from_base_id, to_base_id, quantity, date, status } =
      req.body;
    const userRole = req.user.role;
    const userBaseId = req.user.base_id;

    // Check permissions
    if (userRole === "base_commander" && userBaseId !== from_base_id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Validate transfer
    if (from_base_id === to_base_id) {
      return res.status(400).json({ message: "Cannot transfer to same base" });
    }

    // Check if asset exists and is available
    const asset = await Asset.findByPk(asset_id);
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    if (asset.status !== "available") {
      return res
        .status(400)
        .json({ message: "Asset is not available for transfer" });
    }

    // Create transfer record
    const transfer = await Transfer.create({
      asset_id,
      from_base_id,
      to_base_id,
      quantity,
      date: date || new Date(),
      status: status || "In Progress",
      transferred_by: req.body.transferred_by || "",
      reason: req.body.reason || "",
    });

    // Update asset location
    await asset.update({
      base_id: to_base_id,
    });

    // Get transfer with details
    const transferWithDetails = await Transfer.findByPk(transfer.id, {
      include: [
        { model: Asset, as: "Asset" },
        { model: Base, as: "fromBase" },
        { model: Base, as: "toBase" },
      ],
    });

    res.status(201).json({
      message: "Transfer created successfully",
      transfer: transferWithDetails,
    });
  } catch (error) {
    console.error("Create transfer error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all transfers with filters
const getTransfers = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      from_base_id,
      to_base_id,
      asset_id,
      page = 1,
      limit = 10,
    } = req.query;
    const userRole = req.user.role;
    const userBaseId = req.user.base_id;

    // Build where clause
    let whereClause = {};

    // Role-based filtering
    if (userRole === "base_commander") {
      whereClause[Op.or] = [
        { from_base_id: userBaseId },
        { to_base_id: userBaseId },
      ];
    } else if (userRole === "logistics_officer") {
      whereClause[Op.or] = [
        { from_base_id: userBaseId },
        { to_base_id: userBaseId },
      ];
    }

    // Specific base filters
    if (from_base_id) {
      whereClause.from_base_id = from_base_id;
    }
    if (to_base_id) {
      whereClause.to_base_id = to_base_id;
    }

    // Date filters
    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    // Asset filter
    if (asset_id) {
      whereClause.asset_id = asset_id;
    }

    // Pagination
    const offset = (page - 1) * limit;

    const transfers = await Transfer.findAndCountAll({
      where: whereClause,
      attributes: [
        "id",
        "asset_id",
        "from_base_id",
        "to_base_id",
        "quantity",
        "date",
        "status",
        "transferred_by",
        "reason",
      ],
      include: [
        { model: Asset, as: "Asset" },
        { model: Base, as: "fromBase" },
        { model: Base, as: "toBase" },
      ],
      order: [["date", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      transfers: transfers.rows,
      total: transfers.count,
      page: parseInt(page),
      totalPages: Math.ceil(transfers.count / limit),
    });
  } catch (error) {
    console.error("Get transfers error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get transfer by ID
const getTransferById = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;
    const userBaseId = req.user.base_id;

    const transfer = await Transfer.findByPk(id, {
      attributes: [
        "id",
        "asset_id",
        "from_base_id",
        "to_base_id",
        "quantity",
        "date",
        "status",
        "transferred_by",
        "reason",
      ],
      include: [
        { model: Asset, as: "Asset" },
        { model: Base, as: "fromBase" },
        { model: Base, as: "toBase" },
      ],
    });

    if (!transfer) {
      return res.status(404).json({ message: "Transfer not found" });
    }

    // Check permissions
    if (
      userRole === "base_commander" &&
      transfer.from_base_id !== userBaseId &&
      transfer.to_base_id !== userBaseId
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({ transfer });
  } catch (error) {
    console.error("Get transfer by ID error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get transfer history for an asset
const getAssetTransferHistory = async (req, res) => {
  try {
    const { asset_id } = req.params;
    const userRole = req.user.role;
    const userBaseId = req.user.base_id;

    // Check if user has access to this asset
    const asset = await Asset.findByPk(asset_id);
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    if (userRole === "base_commander" && asset.base_id !== userBaseId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const transfers = await Transfer.findAll({
      where: { asset_id },
      include: [
        { model: Base, as: "fromBase" },
        { model: Base, as: "toBase" },
      ],
      order: [["date", "DESC"]],
    });

    res.json({ transfers });
  } catch (error) {
    console.error("Get asset transfer history error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update transfer
const updateTransfer = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, date, status } = req.body;
    const userRole = req.user.role;
    const userBaseId = req.user.base_id;

    console.log("Update body:", req.body);

    const transfer = await Transfer.findByPk(id);
    if (!transfer) {
      return res.status(404).json({ message: "Transfer not found" });
    }

    // Check permissions
    if (userRole === "base_commander" && transfer.from_base_id !== userBaseId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Only admin can update transfers
    if (userRole !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admin can update transfers" });
    }

    const updateObj = {
      asset_id:
        req.body.asset_id !== undefined ? req.body.asset_id : transfer.asset_id,
      from_base_id:
        req.body.from_base_id !== undefined
          ? req.body.from_base_id
          : transfer.from_base_id,
      to_base_id:
        req.body.to_base_id !== undefined
          ? req.body.to_base_id
          : transfer.to_base_id,
      quantity: quantity !== undefined ? quantity : transfer.quantity,
      date: date !== undefined ? date : transfer.date,
      status: status !== undefined ? status : transfer.status,
      transferred_by:
        req.body.transferred_by !== undefined
          ? req.body.transferred_by
          : transfer.transferred_by,
      reason: req.body.reason !== undefined ? req.body.reason : transfer.reason,
    };
    console.log("Updating transfer with:", updateObj);

    // Ensure date is a valid ISO string
    let dateValue = updateObj.date;
    if (dateValue) {
      // If it's already an ISO string, keep it
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(dateValue)) {
        // already ISO, do nothing
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
        // If it's YYYY-MM-DD, convert to ISO
        dateValue = new Date(dateValue + "T00:00:00.000Z").toISOString();
      } else {
        // Try to parse and convert
        const parsed = new Date(dateValue);
        if (!isNaN(parsed)) {
          dateValue = parsed.toISOString();
        }
      }
    }
    // Update transfer
    await sequelize.query(
      "UPDATE transfers SET asset_id = ?, from_base_id = ?, to_base_id = ?, quantity = ?, date = ?, status = ?, transferred_by = ?, reason = ? WHERE id = ?",
      {
        replacements: [
          updateObj.asset_id,
          updateObj.from_base_id,
          updateObj.to_base_id,
          updateObj.quantity,
          dateValue,
          updateObj.status,
          updateObj.transferred_by,
          updateObj.reason,
          id,
        ],
      }
    );
    await transfer.reload();
    console.log("Sequelize update result: (raw SQL used)");
    // Fetch updated transfer with details
    const transferWithDetails = await Transfer.findByPk(transfer.id, {
      attributes: [
        "id",
        "asset_id",
        "from_base_id",
        "to_base_id",
        "quantity",
        "date",
        "status",
        "transferred_by",
        "reason",
      ],
      include: [
        { model: Asset, as: "Asset" },
        { model: Base, as: "fromBase" },
        { model: Base, as: "toBase" },
      ],
    });
    console.log(
      "Updated transfer (with details):",
      transferWithDetails.toJSON()
    );
    res.json({
      message: "Transfer updated successfully",
      transfer: transferWithDetails,
    });
  } catch (error) {
    console.error("Update transfer error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete transfer
const deleteTransfer = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    const transfer = await Transfer.findByPk(id);
    if (!transfer) {
      return res.status(404).json({ message: "Transfer not found" });
    }

    // Only admin can delete transfers
    if (userRole !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admin can delete transfers" });
    }

    await transfer.destroy();

    res.json({ message: "Transfer deleted successfully" });
  } catch (error) {
    console.error("Delete transfer error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createTransfer,
  getTransfers,
  getTransferById,
  getAssetTransferHistory,
  updateTransfer,
  deleteTransfer,
};
