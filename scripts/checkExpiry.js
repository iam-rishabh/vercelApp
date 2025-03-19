const fs = require("fs").promises;
const path = require("path");

const STORAGE_FILE = path.join(__dirname, "lastFetchTime.txt");

async function isExpired() {
  const daysBefore3 = new Date(Date.now() - 4 * 86400 * 1000).toISOString();

  try {
    // Await the Promise to get the file contents
    const lastFetchTime = await fs.readFile(STORAGE_FILE, "utf-8");
    // console.log("in checkExpiry" + `${daysBefore3}  ${lastFetchTime}`);
    console.log("Expiry Check Successful");
    return new Date(lastFetchTime) < new Date(daysBefore3);
  } catch (err) {
    // Handle file not found or other errors
    console.log(err);
    return true; // Force refresh if file is missing
  }
}

module.exports = { STORAGE_FILE, isExpired };
