"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("transfers", "status", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("transfers", "transferred_by", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("transfers", "reason", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("transfers", "status");
    await queryInterface.removeColumn("transfers", "transferred_by");
    await queryInterface.removeColumn("transfers", "reason");
  },
};
