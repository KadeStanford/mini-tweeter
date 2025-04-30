const mongoose = require("mongoose");

const MONGO_URI =
  "mongodb+srv://kade:Stanford24@cmps415.zsbfjv5.mongodb.net/?retryWrites=true&w=majority&appName=CMPS415";

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
