const { Assignment, Asset, User, Base } = require("../models/associations");
const { Op } = require("sequelize");

// Assign asset to personnel
const assignAsset = async (req, res) => {
  try {
    const { asset_id, personnel_id, assigned_at } = req.body;
    const userRole = req.user.role;
    const userBaseId = req.user.base_id;

    // Check if asset exists and is available
    const asset = await Asset.findByPk(asset_id);
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    if (asset.status !== "available") {
      return res
        .status(400)
        .json({ message: "Asset is not available for assignment" });
    }

    // Check permissions
    if (userRole === "base_commander" && asset.base_id !== userBaseId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Check if personnel exists
    const personnel = await User.findByPk(personnel_id);
    if (!personnel) {
      return res.status(404).json({ message: "Personnel not found" });
    }

    // Check if asset is already assigned
    const existingAssignment = await Assignment.findOne({
      where: {
        asset_id,
        expended_date: null,
      },
    });

    if (existingAssignment) {
      return res.status(400).json({ message: "Asset is already assigned" });
    }

    // Create assignment
    const assignment = await Assignment.create({
      asset_id,
      personnel_id,
      assigned_at: assigned_at || new Date(),
      assigned_by: req.body.assigned_by || null,
    });

    // Update asset status
    await asset.update({ status: "assigned" });

    // Get assignment with details
    const assignmentWithDetails = await Assignment.findByPk(assignment.id, {
      include: [
        { model: Asset, as: "Asset" },
        { model: User, as: "Personnel" },
      ],
    });

    res.status(201).json({
      message: "Asset assigned successfully",
      assignment: assignmentWithDetails,
    });
  } catch (error) {
    console.error("Assign asset error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Mark asset as expended
const expendAsset = async (req, res) => {
  try {
    const { assignment_id, expended_date } = req.body;
    const userRole = req.user.role;
    const userBaseId = req.user.base_id;

    const assignment = await Assignment.findByPk(assignment_id, {
      include: [{ model: Asset, as: "Asset" }],
    });

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Check permissions
    if (
      userRole === "base_commander" &&
      assignment.Asset.base_id !== userBaseId
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (assignment.expended_date) {
      return res
        .status(400)
        .json({ message: "Asset is already marked as expended" });
    }

    // Update assignment
    await assignment.update({
      expended_date: expended_date || new Date(),
    });

    // Update asset status
    await assignment.Asset.update({ status: "available" });

    res.json({
      message: "Asset marked as expended successfully",
      assignment,
    });
  } catch (error) {
    console.error("Expend asset error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all assignments with filters
const getAssignments = async (req, res) => {
  try {
    const {
      asset_id,
      personnel_id,
      status,
      startDate,
      endDate,
      base_id,
      page = 1,
      limit = 10,
    } = req.query;
    const userRole = req.user.role;
    const userBaseId = req.user.base_id;

    // Build where clause
    let whereClause = {};

    // Status filter
    if (status === "active") {
      whereClause.expended_date = null;
    } else if (status === "expended") {
      whereClause.expended_date = {
        [Op.not]: null,
      };
    }

    // Date filters
    if (startDate && endDate) {
      whereClause.assigned_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    // Asset filter
    if (asset_id) {
      whereClause.asset_id = asset_id;
    }

    // Personnel filter
    if (personnel_id) {
      whereClause.personnel_id = personnel_id;
    }

    // Build include clause for role-based filtering
    let includeClause = [
      { model: Asset, as: "Asset" },
      { model: User, as: "Personnel" },
    ];

    // Role-based filtering
    if (userRole === "base_commander" || userRole === "logistics_officer") {
      includeClause[0].where = { base_id: userBaseId };
    } else if (base_id) {
      includeClause[0].where = { base_id };
    }

    // Pagination
    const offset = (page - 1) * limit;

    const assignments = await Assignment.findAndCountAll({
      where: whereClause,
      include: includeClause,
      order: [["assigned_at", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      assignments: assignments.rows,
      total: assignments.count,
      page: parseInt(page),
      totalPages: Math.ceil(assignments.count / limit),
    });
  } catch (error) {
    console.error("Get assignments error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get assignment by ID
const getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;
    const userBaseId = req.user.base_id;

    const assignment = await Assignment.findByPk(id, {
      include: [
        { model: Asset, as: "Asset" },
        { model: User, as: "Personnel" },
      ],
    });

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Check permissions
    if (
      userRole === "base_commander" &&
      assignment.Asset.base_id !== userBaseId
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({ assignment });
  } catch (error) {
    console.error("Get assignment by ID error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get assignments for a specific asset
const getAssetAssignments = async (req, res) => {
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

    const assignments = await Assignment.findAll({
      where: { asset_id },
      include: [{ model: User, as: "Personnel" }],
      order: [["assigned_at", "DESC"]],
    });

    res.json({ assignments });
  } catch (error) {
    console.error("Get asset assignments error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get assignments for a specific personnel
const getPersonnelAssignments = async (req, res) => {
  try {
    const { personnel_id } = req.params;
    const userRole = req.user.role;
    const userBaseId = req.user.base_id;

    // Check if user has access to this personnel
    const personnel = await User.findByPk(personnel_id);
    if (!personnel) {
      return res.status(404).json({ message: "Personnel not found" });
    }

    if (userRole === "base_commander" && personnel.base_id !== userBaseId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const assignments = await Assignment.findAll({
      where: { personnel_id },
      include: [{ model: Asset, as: "Asset" }],
      order: [["assigned_at", "DESC"]],
    });

    res.json({ assignments });
  } catch (error) {
    console.error("Get personnel assignments error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update assignment
const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { assigned_at, expended_date } = req.body;
    const userRole = req.user.role;
    const userBaseId = req.user.base_id;

    const assignment = await Assignment.findByPk(id, {
      include: [{ model: Asset, as: "Asset" }],
    });

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Check permissions
    if (
      userRole === "base_commander" &&
      assignment.Asset.base_id !== userBaseId
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Only admin can update assignments
    if (userRole !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admin can update assignments" });
    }

    // Update assignment
    await assignment.update({
      asset_id: req.body.asset_id || assignment.asset_id,
      personnel_id: req.body.personnel_id || assignment.personnel_id,
      assigned_by: req.body.assigned_by || assignment.assigned_by,
      assigned_at: assigned_at || assignment.assigned_at,
      expended_date:
        typeof expended_date !== "undefined"
          ? expended_date
          : assignment.expended_date,
    });

    // Fetch updated assignment with associations
    const updatedAssignment = await Assignment.findByPk(assignment.id, {
      include: [
        { model: Asset, as: "Asset" },
        { model: User, as: "Personnel" },
      ],
    });

    res.json({
      message: "Assignment updated successfully",
      assignment: updatedAssignment,
    });
  } catch (error) {
    console.error("Update assignment error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete assignment
const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    // Only admin can delete assignments
    if (userRole !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admin can delete assignments" });
    }

    const assignment = await Assignment.findByPk(id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    await assignment.destroy();
    res.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    console.error("Delete assignment error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  assignAsset,
  expendAsset,
  getAssignments,
  getAssignmentById,
  getAssetAssignments,
  getPersonnelAssignments,
  updateAssignment,
  deleteAssignment,
};
