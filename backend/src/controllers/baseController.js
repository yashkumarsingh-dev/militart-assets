const { Base } = require("../models/associations-sqlite");

// Get all bases
const getBases = async (req, res) => {
  try {
    const bases = await Base.findAll();
    res.json({ bases });
  } catch (error) {
    console.error("Get bases error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getBases };
