const { sequelize, DataTypes } = require("./index");

const Assignment = sequelize.define(
  "Assignment",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    asset_id: { type: DataTypes.INTEGER, allowNull: false },
    personnel_id: { type: DataTypes.INTEGER, allowNull: false },
    assigned_date: { type: DataTypes.DATE, allowNull: false },
    expended_date: { type: DataTypes.DATE, allowNull: true },
    assigned_by: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: "assignments",
    timestamps: false,
  }
);

module.exports = Assignment;
