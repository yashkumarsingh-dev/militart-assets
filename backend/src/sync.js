const { sequelize } = require("./models");
const models = require("./models/associations");

(async () => {
  try {
    await sequelize.sync({ alter: true });
    // console.log("All models were synchronized successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Unable to synchronize the models:", error);
    process.exit(1);
  }
})();
