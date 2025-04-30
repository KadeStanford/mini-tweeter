/**
 * Run once:  node createCollections.js
 *
 * Creates all required collections with a single placeholder document each,
 * then removes the placeholders—leaving empty, indexed collections ready
 * for teamwork.
 */

require("./src/config/db"); // the singleton connection
const mongoose = require("mongoose");

// ----- USERS ------------------------------------------------------------
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  subscriptions: [mongoose.Schema.Types.ObjectId],
});
const User = mongoose.model("User", userSchema);

// ----- TOPICS -----------------------------------------------------------
const topicSchema = new mongoose.Schema({
  title: String,
  creatorId: mongoose.Schema.Types.ObjectId,
  viewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});
const Topic = mongoose.model("Topic", topicSchema);

// ----- MESSAGES ---------------------------------------------------------
const messageSchema = new mongoose.Schema({
  topicId: mongoose.Schema.Types.ObjectId,
  authorId: mongoose.Schema.Types.ObjectId,
  body: String,
  createdAt: { type: Date, default: Date.now },
});
const Message = mongoose.model("Message", messageSchema);

// ----- STATS (optional) -------------------------------------------------
const statsSchema = new mongoose.Schema({
  topicId: mongoose.Schema.Types.ObjectId,
  hits: Number,
  lastAccessed: Date,
});
const Stats = mongoose.model("Stats", statsSchema);

// ----- NOTIFICATIONS (optional) ----------------------------------------
const noteSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  message: String,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
const Notification = mongoose.model("Notification", noteSchema);

// -----------------------------------------------------------------------
(async () => {
  // create one dummy doc per collection
  const dummyUser = await User.create({
    username: "_init_",
    email: "x@x",
    password: "x",
  });
  const dummyTopic = await Topic.create({
    title: "_init_",
    creatorId: dummyUser._id,
  });
  await Message.create({
    topicId: dummyTopic._id,
    authorId: dummyUser._id,
    body: "_init_",
  });
  await Stats.create({
    topicId: dummyTopic._id,
    hits: 0,
    lastAccessed: new Date(),
  });
  await Notification.create({ userId: dummyUser._id, message: "_init_" });

  // now wipe the placeholders so collections are empty
  await Promise.all([
    User.deleteMany({ username: "_init_" }),
    Topic.deleteMany({ title: "_init_" }),
    Message.deleteMany({ body: "_init_" }),
    Stats.deleteMany({ hits: 0 }),
    Notification.deleteMany({ message: "_init_" }),
  ]);

  console.log("✅ All collections created and placeholders removed.");
  mongoose.connection.close();
})();
