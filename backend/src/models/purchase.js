const { sequelize, DataTypes } = require("./index");

const Purchase = sequelize.define(
  "Purchase",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    asset_type: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    base_id: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: true },
    approved_by: { type: DataTypes.STRING, allowNull: true },
    requested_by: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: "purchases",
    timestamps: false,
  }
);

module.exports = Purchase;
