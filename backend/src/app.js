const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { logTransaction } = require("./middleware/logging");
require("dotenv").config();

// Set JWT_SECRET if not provided
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET =
    "your-super-secret-jwt-key-change-this-in-production";
  // console.log(" JWT_SECRET not set, using default (change in production)");
}

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const assetRoutes = require("./routes/assets");
const purchaseRoutes = require("./routes/purchases");
const transferRoutes = require("./routes/transfers");
const assignmentRoutes = require("./routes/assignments");
const auditRoutes = require("./routes/audit");
const baseRoutes = require("./routes/bases");

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(logTransaction); // Log all API transactions

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Military Asset Management System Backend is running.",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/transfers", transferRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/bases", baseRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  // console.log(` Health check: http://localhost:${PORT}/api/health`);
  // console.log(` Auth endpoints: http://localhost:${PORT}/api/auth`);
  // console.log(` Dashboard endpoints: http://localhost:${PORT}/api/dashboard`);
  // console.log(` Purchase endpoints: http://localhost:${PORT}/api/purchases`);
  // console.log(` Transfer endpoints: http://localhost:${PORT}/api/transfers`);
  // console.log(
  //   ` Assignment endpoints: http://localhost:${PORT}/api/assignments`
  // );
  // console.log(` Audit endpoints: http://localhost:${PORT}/api/audit`);
});
