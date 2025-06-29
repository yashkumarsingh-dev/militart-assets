const { sequelize, DataTypes } = require("./index");

const Base = sequelize.define(
  "Base",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: "bases",
    timestamps: false,
  }
);

module.exports = Base;
