const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Military Asset Management System Backend is running.",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// console.log("✅ Basic middleware and health check loaded");

// Test routes one by one
const routesToTest = [
  { name: "auth", path: "./routes/auth", prefix: "/api/auth" },
  {
    name: "dashboard",
    path: "./routes/dashboard-minimal",
    prefix: "/api/dashboard",
  },
  { name: "purchases", path: "./routes/purchases", prefix: "/api/purchases" },
  { name: "transfers", path: "./routes/transfers", prefix: "/api/transfers" },
  {
    name: "assignments",
    path: "./routes/assignments-minimal",
    prefix: "/api/assignments",
  },
  { name: "audit", path: "./routes/audit", prefix: "/api/audit" },
];

for (const route of routesToTest) {
  try {
    // console.log(`🔄 Loading ${route.name} routes...`);
    const routeModule = require(route.path);
    app.use(route.prefix, routeModule);
    // console.log(`✅ ${route.name} routes loaded successfully`);
  } catch (error) {
    console.error(`❌ ${route.name} routes failed:`, error.message);
    console.error(`   Full error:`, error);
    break; // Stop on first error
  }
}

// console.log("✅ All routes loaded successfully");

app.listen(PORT, () => {
  console.log(`🚀 Diagnostic server running on port ${PORT}`);
  // console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
