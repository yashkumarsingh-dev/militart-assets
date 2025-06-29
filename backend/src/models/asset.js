const { sequelize, DataTypes } = require("./index");

const Asset = sequelize.define(
  "Asset",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    type: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
    serial_number: { type: DataTypes.STRING, unique: true },
    base_id: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: "assets",
    timestamps: false,
  }
);

module.exports = Asset;
