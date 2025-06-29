const {
  Asset,
  Assignment,
  User,
  Base,
  Purchase,
  Transfer,
} = require("../models/associations");
const { Op } = require("sequelize");

// Get dashboard metrics
const getDashboardMetrics = async (req, res) => {
  try {
    // console.log("Dashboard metrics requested by user:", req.user);
    const { startDate, endDate, base_id, equipment_type } = req.query;
    const userRole = req.user.role;
    const userBaseId = req.user.base_id;

    // Build where clause based on user role
    let whereClause = {};
    if (userRole === "base_commander") {
      whereClause.base_id = userBaseId;
    } else if (userRole === "logistics_officer") {
      whereClause.base_id = userBaseId;
    }
    // Admin can see all data

    // Add date filters
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    // Add equipment type filter
    if (equipment_type) {
      whereClause.type = equipment_type;
    }

    // Get opening balance (assets at start of period)
    const openingBalance = await Asset.count({
      where: {
        ...whereClause,
        createdAt: {
          [Op.lt]: startDate ? new Date(startDate) : new Date("1970-01-01"),
        },
      },
    });

    // Get closing balance (assets at end of period)
    const closingBalance = await Asset.count({
      where: {
        ...whereClause,
        createdAt: {
          [Op.lte]: endDate ? new Date(endDate) : new Date(),
        },
      },
    });

    // Get purchases
    const purchases =
      (await Purchase.sum("quantity", {
        where: {
          ...whereClause,
          date: {
            [Op.between]: [
              startDate ? new Date(startDate) : new Date("1970-01-01"),
              endDate ? new Date(endDate) : new Date(),
            ],
          },
        },
      })) || 0;

    // Get transfers in
    let transfersInWhere = {
      date: {
        [Op.between]: [
          startDate ? new Date(startDate) : new Date("1970-01-01"),
          endDate ? new Date(endDate) : new Date(),
        ],
      },
    };
    if (userRole !== "admin") {
      transfersInWhere.to_base_id = userBaseId;
    }
    const transfersIn =
      (await Transfer.sum("quantity", {
        where: transfersInWhere,
      })) || 0;

    // Get transfers out
    let transfersOutWhere = {
      date: {
        [Op.between]: [
          startDate ? new Date(startDate) : new Date("1970-01-01"),
          endDate ? new Date(endDate) : new Date(),
        ],
      },
    };
    if (userRole !== "admin") {
      transfersOutWhere.from_base_id = userBaseId;
    }
    const transfersOut =
      (await Transfer.sum("quantity", {
        where: transfersOutWhere,
      })) || 0;

    // Calculate net movement
    const netMovement = purchases + transfersIn - transfersOut;

    // Get assigned assets
    const assignedAssets = await Assignment.count({
      where: {
        expended_date: null,
      },
      include: [
        {
          model: Asset,
          where: whereClause,
        },
      ],
    });

    // Get expended assets
    const expendedAssets = await Assignment.count({
      where: {
        expended_date: {
          [Op.not]: null,
        },
      },
      include: [
        {
          model: Asset,
          where: whereClause,
        },
      ],
    });

    res.json({
      metrics: {
        openingBalance,
        closingBalance,
        netMovement,
        purchases,
        transfersIn,
        transfersOut,
        assignedAssets,
        expendedAssets,
      },
    });
  } catch (error) {
    console.error("Dashboard metrics error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get detailed net movement breakdown
const getNetMovementDetails = async (req, res) => {
  try {
    const { startDate, endDate, base_id } = req.query;
    const userRole = req.user.role;
    const userBaseId = req.user.base_id;

    // Get purchases details
    const purchases = await Purchase.findAll({
      where: {
        base_id: userRole !== "admin" ? userBaseId : undefined,
        date: {
          [Op.between]: [
            startDate ? new Date(startDate) : new Date("1970-01-01"),
            endDate ? new Date(endDate) : new Date(),
          ],
        },
      },
      include: [{ model: Base, as: "Base" }],
      order: [["date", "DESC"]],
    });

    // Get transfers in details
    const transfersIn = await Transfer.findAll({
      where: {
        to_base_id: userRole !== "admin" ? userBaseId : undefined,
        date: {
          [Op.between]: [
            startDate ? new Date(startDate) : new Date("1970-01-01"),
            endDate ? new Date(endDate) : new Date(),
          ],
        },
      },
      include: [
        { model: Asset, as: "Asset" },
        { model: Base, as: "toBase" },
      ],
      order: [["date", "DESC"]],
    });

    // Get transfers out details
    const transfersOut = await Transfer.findAll({
      where: {
        from_base_id: userRole !== "admin" ? userBaseId : undefined,
        date: {
          [Op.between]: [
            startDate ? new Date(startDate) : new Date("1970-01-01"),
            endDate ? new Date(endDate) : new Date(),
          ],
        },
      },
      include: [
        { model: Asset, as: "Asset" },
        { model: Base, as: "fromBase" },
      ],
      order: [["date", "DESC"]],
    });

    res.json({
      purchases,
      transfersIn,
      transfersOut,
    });
  } catch (error) {
    console.error("Net movement details error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getDashboardMetrics,
  getNetMovementDetails,
};
