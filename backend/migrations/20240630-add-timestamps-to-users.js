"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("users", "createdAt", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn("NOW"),
    });
    await queryInterface.addColumn("users", "updatedAt", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn("NOW"),
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "createdAt");
    await queryInterface.removeColumn("users", "updatedAt");
  },
};
