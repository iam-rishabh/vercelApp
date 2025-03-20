const express = require("express");
const path = require("path");
var cors = require("cors");
const fs = require("fs").promises;
const { STORAGE_FILE, isExpired } = require("./scripts/checkExpiry");
const { main } = require("./scripts/writeFile");

const app = express();

app.use(express.static(path.join(__dirname, "../client")));

app.get("/scholar", cors(), async (req, res) => {
  const expired = await isExpired();
  try {
    // Check if data needs update
    res.send("hi");
    if (expired) {
      await main();
      //Update last fetch time after successful update
      await fs.writeFile(STORAGE_FILE, new Date().toISOString());
      //   }

      //Send JSON response
      const filePath = path.join(__dirname, "dataFile/scholar.json");
      res.sendFile(filePath);
    } else {
      const filePath = path.join(__dirname, "dataFile/scholar.json");
      res.sendFile(filePath);
    }
  } catch (error) {
    //try

    console.error("Error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
});

app.listen(5000, () => {
  console.log("Server is listening on http://localhost:5000");
});
