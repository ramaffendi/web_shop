const mongoose = require("mongoose");
const { mongoURI } = require("../app/config.js"); // Import mongoURI dari config.js

if (!mongoURI) {
  console.error("MONGO_URI is not defined in .env file!");
  process.exit(1);
}

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected successfully"))
  .catch((error) => console.error("Database connection error:", error));

const db = mongoose.connection;
module.exports = db;
