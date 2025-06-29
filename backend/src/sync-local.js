const { sequelize } = require("./models/index-sqlite");
const models = require("./models/associations");

// console.log("Starting local database sync...");

(async () => {
  try {
    // console.log("Testing database connection...");
    await sequelize.authenticate();
    // console.log("✅ Database connection successful!");

    // console.log("Syncing models...");
    await sequelize.sync({ force: true }); // force: true will drop and recreate tables
    // console.log("✅ All models were synchronized successfully with SQLite!");
    // console.log("📁 Database file created at: database.sqlite");
    process.exit(0);
  } catch (error) {
    console.error("❌ Unable to synchronize the models:", error);
    process.exit(1);
  }
})();
