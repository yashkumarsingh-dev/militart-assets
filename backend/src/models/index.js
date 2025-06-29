const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");

// Manually read .env file if dotenv fails
let databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  try {
    const envPath = path.join(__dirname, "..", "..", ".env");
    // console.log("Trying to read .env from:", envPath);
    const envContent = fs.readFileSync(envPath, "utf8");
    // console.log("Raw .env content:", envContent);
    const envVars = {};
    envContent.split("\n").forEach((line) => {
      const [key, value] = line.split("=");
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    });
    
    databaseUrl = envVars.DATABASE_URL;
    
  } catch (error) {
    console.error("Could not read .env file:", error.message);
  }
}

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set. Please check your .env file.");
}


const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  logging: false,
});

// Export sequelize instance and DataTypes
module.exports = {
  sequelize,
  Sequelize,
  DataTypes: require("sequelize").DataTypes,
};
