const fs = require("fs").promises; // Use promises version of fs
const fetch = require("node-fetch"); // Install with npm install node-fetch

async function writeFile(apiUrl) {
  try {
    // Fetch Data
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const jsonString = JSON.stringify(data, null, 2);

    // Write data to file
    await fs.writeFile("./dataFile/scholar.json", jsonString);
    console.log("Write Successful");
  } catch (error) {
    console.error("Error:", error);
  }
}

async function main() {
  const apiUrl =
    "https://serpapi.com/search.json?engine=google_scholar_author&author_id=KLDQnqUAAAAJ&hl=en&sort=pubdate&num=100&api_key=13944512df2402fc973a3f13efbbb5ea67fadc9f51498e3dc598e181371c1404";

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
