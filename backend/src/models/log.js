const { sequelize, DataTypes } = require("./index");

const Log = sequelize.define(
  "Log",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    action: { type: DataTypes.STRING, allowNull: false },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    details: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: "logs",
    timestamps: false,
  }
);

module.exports = Log;
