const fetch = require("node-fetch");
const dotenv = require("dotenv");
dotenv.config();

async function isExpired() {
  const daysBefore3 = new Date(Date.now() - 4 * 86400 * 1000).toISOString();

  try {
    const response = await fetch(process.env.expiryFileUrl);
    if (!response.ok) throw new Error(`Blob fetch failed: ${response.status}`);
    const lastFetchTime = await response.text();
    console.log("Expiry Check Successful", lastFetchTime);
    return new Date(lastFetchTime) < new Date(daysBefore3);
  } catch (err) {
    console.log(err);
    return true;
  }
}

module.exports = { isExpired };
