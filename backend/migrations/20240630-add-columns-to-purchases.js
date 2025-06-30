"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("purchases", "asset_type", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("purchases", "status", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("purchases", "approved_by", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("purchases", "requested_by", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("purchases", "asset_type");
    await queryInterface.removeColumn("purchases", "status");
    await queryInterface.removeColumn("purchases", "approved_by");
    await queryInterface.removeColumn("purchases", "requested_by");
  },
};
