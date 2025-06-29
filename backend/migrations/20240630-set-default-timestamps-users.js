"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("users", "createdAt", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn("NOW"),
    });
    await queryInterface.changeColumn("users", "updatedAt", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn("NOW"),
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("users", "createdAt", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: null,
    });
    await queryInterface.changeColumn("users", "updatedAt", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: null,
    });
  },
};
