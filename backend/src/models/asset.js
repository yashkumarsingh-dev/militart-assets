const { sequelize, DataTypes } = require("./index");

const Asset = sequelize.define(
  "Asset",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    serial_number: { type: DataTypes.STRING, unique: true },
    base_id: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    value: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    tableName: "assets",
    timestamps: true,
  }
);

module.exports = Asset;
