const { sequelize } = require("./models/index-sqlite");
const { seedData } = require("./seed-data");

(async () => {
  try {
    // console.log("Syncing database...");
    await sequelize.sync({ force: true }); // This will drop and recreate all tables

    // console.log("Seeding database...");
    await seedData();

    // console.log("Database setup completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database setup failed:", error);
    process.exit(1);
  }
})();
