const { sequelize, DataTypes } = require("./index-sqlite");

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

const Asset = sequelize.define(
  "Asset",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    type: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    serial_number: { type: DataTypes.STRING, allowNull: false, unique: true },
    base_id: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM("available", "assigned", "maintenance", "retired"),
      allowNull: false,
      defaultValue: "available",
    },
    value: { type: DataTypes.FLOAT, allowNull: true },
  },
  {
    tableName: "assets",
    timestamps: true,
  }
);

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

const Transfer = sequelize.define(
  "Transfer",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    asset_id: { type: DataTypes.INTEGER, allowNull: false },
    from_base_id: { type: DataTypes.INTEGER, allowNull: false },
    to_base_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
  },
  {
    tableName: "transfers",
    timestamps: false,
  }
);

const Assignment = sequelize.define(
  "Assignment",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    asset_id: { type: DataTypes.INTEGER, allowNull: false },
    personnel_id: { type: DataTypes.INTEGER, allowNull: false },
    assigned_at: { type: DataTypes.DATE, allowNull: false },
    date_returned: { type: DataTypes.DATE, allowNull: true },
    expended_date: { type: DataTypes.DATE, allowNull: true },
    assigned_by: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: "assignments",
    timestamps: false,
  }
);

const Log = sequelize.define(
  "Log",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    action: { type: DataTypes.STRING, allowNull: false },
    details: { type: DataTypes.TEXT, allowNull: false },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    ip_address: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: "logs",
    timestamps: false,
  }
);

// Associations
User.belongsTo(Base, { foreignKey: "base_id" });
Base.hasMany(User, { foreignKey: "base_id" });

Asset.belongsTo(Base, { foreignKey: "base_id" });
Base.hasMany(Asset, { foreignKey: "base_id" });

Purchase.belongsTo(Base, { foreignKey: "base_id" });
Base.hasMany(Purchase, { foreignKey: "base_id" });

Transfer.belongsTo(Asset, { foreignKey: "asset_id" });
Asset.hasMany(Transfer, { foreignKey: "asset_id" });
Transfer.belongsTo(Base, { as: "fromBase", foreignKey: "from_base_id" });
Transfer.belongsTo(Base, { as: "toBase", foreignKey: "to_base_id" });

Assignment.belongsTo(Asset, { foreignKey: "asset_id" });
Asset.hasMany(Assignment, { foreignKey: "asset_id" });
Assignment.belongsTo(User, { foreignKey: "personnel_id", as: "Personnel" });
User.hasMany(Assignment, { foreignKey: "personnel_id" });

Log.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Log, { foreignKey: "user_id" });

module.exports = {
  User,
  Base,
  Asset,
  Purchase,
  Transfer,
  Assignment,
  Log,
};
