const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");

// Read .env file
const envPath = path.join(__dirname, "..", ".env");
const envContent = fs.readFileSync(envPath, "utf8");
const envVars = {};
envContent.split("\n").forEach((line) => {
  const [key, value] = line.split("=");
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const databaseUrl = envVars.DATABASE_URL;
// console.log("Testing connection to:", databaseUrl.substring(0, 50) + "...");

const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  retry: {
    max: 3,
  },
});

(async () => {
  try {
    // console.log("Attempting to connect to database...");
    await sequelize.authenticate();
    // console.log("✅ Database connection successful!");

    // Test a simple query
    const result = await sequelize.query("SELECT NOW() as current_time");
    // console.log("✅ Query test successful:", result[0][0]);

    await sequelize.close();
    // console.log("✅ Connection closed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.error("Error details:", error);
    process.exit(1);
  }
})();
