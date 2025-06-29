const { sequelize, DataTypes } = require("./index");

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM("admin", "base_commander", "logistics_officer"),
      allowNull: false,
    },
    base_id: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

module.exports = User;
