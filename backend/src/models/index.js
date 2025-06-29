const fs = require("fs");
const path = require("path");
const { Sequelize } = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config);
}

// Export sequelize instance and DataTypes
module.exports = {
  sequelize,
  Sequelize,
  DataTypes: require("sequelize").DataTypes,
};
