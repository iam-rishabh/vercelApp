const fetch = require("node-fetch");
const dotenv = require("dotenv");
const { put } = require("@vercel/blob");
dotenv.config();

async function writeFile(apiUrl) {
  try {
    // Fetch Data
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const jsonString = JSON.stringify(data, null, 2);

    // Upload data to Vercel Blob storage
    const blob = await put("data.json", jsonString, {
      access: "public", // Make the blob publicly accessible
      contentType: "application/json", // Specify content type
    });

    console.log("Write Successful:", blob.url);
  } catch (error) {
    console.error("Error:", error);
  }
}

const ApiURL = process.env.apiURL;

async function main() {
  const apiUrl = ApiURL;

  try {
    await writeFile(apiUrl);

    const currentdate = new Date();
    const datetime =
      "Last Sync: " +
      currentdate.getDate() +
      "/" +
      (currentdate.getMonth() + 1) +
      "/" +
      currentdate.getFullYear() +
      " @ " +
      currentdate.getHours() +
      ":" +
      currentdate.getMinutes() +
      ":" +
      currentdate.getSeconds();

    console.log("Data fetched and written successfully", datetime);
    return;
  } catch (error) {
    console.error("Failed to fetch and insert data:", error);
  }
}

module.exports = { main };
