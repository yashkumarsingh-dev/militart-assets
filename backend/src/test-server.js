const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Basic middleware
app.use(cors());
app.use(express.json());

// Simple health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Test server is running",
    timestamp: new Date().toISOString(),
  });
});

// Test route with parameter
app.get("/api/test/:id", (req, res) => {
  res.json({
    message: "Test route works",
    id: req.params.id,
  });
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
