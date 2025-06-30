"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("purchases", "base_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "bases",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("purchases", "base_id");
  },
};
