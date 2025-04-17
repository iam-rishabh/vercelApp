const dotenv = require("dotenv");
const fetch = require("node-fetch");
dotenv.config();

const STORAGE_FILE = process.env.expiryFileUrl;

const lastFetchTime = await fetch(STORAGE_FILE);

console.log(lastFetchTime);
