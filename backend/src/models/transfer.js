const { sequelize, DataTypes } = require("./index");

const Transfer = sequelize.define(
  "Transfer",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    asset_id: { type: DataTypes.INTEGER, allowNull: false },
    from_base_id: { type: DataTypes.INTEGER, allowNull: false },
    to_base_id: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "In Progress",
      field: "status",
    },
    transferred_by: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "transferred_by",
    },
    reason: { type: DataTypes.STRING, allowNull: true, field: "reason" },
  },
  {
    tableName: "transfers",
    timestamps: false,
  }
);

module.exports = Transfer;
