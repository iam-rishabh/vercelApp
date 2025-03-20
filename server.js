const express = require("express");
const path = require("path");
const cors = require("cors");
const fs = require("fs").promises;
const { STORAGE_FILE, isExpired } = require("./scripts/checkExpiry");
const { main } = require("./scripts/writeFile");

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes

// Default route to redirect to /scholar
app.get("/", (req, res) => {
  res.redirect("/scholar"); // Redirects to /scholar page
});

// Route to serve data from /scholar
app.get("/scholar", async (req, res) => {
  try {
    const expired = await isExpired();

    if (expired) {
      await main(); // Update data if expired
      await fs.writeFile(STORAGE_FILE, new Date().toISOString()); // Update timestamp
    }

    const filePath = path.join(__dirname, "dataFile/scholar.json");
    res.sendFile(filePath); // Send JSON file as response
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to process request" }); // Error response
  }
});

// Start the server
const PORT = process.env.PORT || 5000; // Use environment variable or default port
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});

module.exports = app;
