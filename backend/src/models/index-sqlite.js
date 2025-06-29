const { Sequelize } = require("sequelize");
const path = require("path");

// Use SQLite for local development
const dbPath = path.join(__dirname, "..", "..", "database.sqlite");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: dbPath,
  logging: false,
});

// console.log("Using SQLite database for local development:", dbPath);

// Export sequelize instance and DataTypes
module.exports = {
  sequelize,
  Sequelize,
  DataTypes: require("sequelize").DataTypes,
};
