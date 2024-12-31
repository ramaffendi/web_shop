const mongoose = require("mongoose");
const { dbHost, dbName, dbPort } = require("../app/config.js");

mongoose
  .connect(`mongodb://${dbHost}:${dbPort}/${dbName}`)
  .then(() => console.log("Database connected successfully"))
  .catch((error) => console.error("Database connection error:", error));

const db = mongoose.connection;
module.exports = db;
