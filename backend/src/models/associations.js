const User = require("./user");
const Base = require("./base");
const Asset = require("./asset");
const Purchase = require("./purchase");
const Transfer = require("./transfer");
const Assignment = require("./assignment");
const Log = require("./log");

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
User.hasMany(Assignment, {
  foreignKey: "personnel_id",
  as: "PersonnelAssignments",
});

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
