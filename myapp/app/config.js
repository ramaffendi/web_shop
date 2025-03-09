const dotenv = require("dotenv");
const path = require("path");

dotenv.config(); // Load konfigurasi dari .env

module.exports = {
  rootPath: path.resolve(__dirname, ".."),
  mongoURI: process.env.MONGO_URI, // Pastikan ini terbaca dari .env
  secretKey: process.env.SECRET_KEY,
};
