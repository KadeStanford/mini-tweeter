const mongoose = require("mongoose");
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

class Database {
  constructor() {
    if (Database.instance) return Database.instance;
    mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoose.connection.once("open", () =>
      console.log("✅ MongoDB connected.")
    );
    mongoose.connection.on("error", console.error);
    Database.instance = this;
  }
}

module.exports = new Database();
