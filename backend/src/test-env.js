const path = require("path");
const fs = require("fs");

const envPath = path.join(__dirname, "..", ".env");
// console.log("Checking if .env file exists:", fs.existsSync(envPath));

require("dotenv").config({ path: envPath, debug: true });

// console.log("Environment variables test:");
// console.log("Current directory:", __dirname);
// console.log("Env file path:", envPath);
// console.log("DATABASE_URL:", process.env.DATABASE_URL ? "SET" : "NOT SET");
// console.log("PORT:", process.env.PORT);
// console.log("JWT_SECRET:", process.env.JWT_SECRET ? "SET" : "NOT SET");

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Please check your .env file.");
  process.exit(1);
}

// console.log("Environment variables loaded successfully!");
