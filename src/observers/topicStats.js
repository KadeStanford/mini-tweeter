const eventBus = require("../eventbus");
const Topic = require("../models/topic");

/* view counter */
eventBus.subscribe("topicViewed", async (topicId) => {
  try {
    await Topic.findByIdAndUpdate(topicId, { $inc: { viewCount: 1 } });
  } catch (err) {
    console.error("Error incrementing viewCount:", err);
  }
});

/* reply counter */
eventBus.subscribe("newMessage", async (message) => {
  try {
    await Topic.findByIdAndUpdate(message.topicId, { $inc: { replyCount: 1 } });
  } catch (err) {
    console.error("Error incrementing replyCount:", err);
  }
});
