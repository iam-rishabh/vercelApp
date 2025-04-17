const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const { isExpired } = require("./scripts/checkExpiry");
const { main } = require("./scripts/writeFile");
const dotenv = require("dotenv");
const fetch = require("node-fetch");
dotenv.config();

const app = express();
const blobStorage = process.env.blobUrl;
// Middleware
app.use(cors()); // Enable CORS for all routes

// Default route to redirect to /scholar
app.get("/", (req, res) => {
  res.redirect("/scholar");
});

// Route to serve data from /scholar
app.get("/scholar", async (req, res) => {
  try {
    const expired = await isExpired();

    if (expired) {
      await main(); // Update data if expired
      await fetch(process.env.expiryFileUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "text/plain",
        },
        body: new Date().toISOString(),
      });
    }
    const response = await fetch(blobStorage);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch blob data. HTTP status: ${response.status}`
      );
    }

    const blobData = await response.json();
    res.json(blobData); // Send JSON data as response
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to process request" }); //
  }
});

// Start the server
const PORT = process.env.PORT || 5000; // Use environment variable or default port
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});

module.exports = app;
