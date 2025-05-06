const Topic = require("../models/topic");
const Message = require("../models/message");
const Subscription = require("../models/subscription");
const eventBus = require("../eventbus"); // ★ added

/* ========== new-topic form ========== */
exports.getNewTopicForm = async (req, res) => {
  if (!req.session.userId) return res.redirect("/login");

  try {
    const user = await require("../models/user").findById(req.session.userId);
    res.render("new-topic", { user, title: "Create New Topic" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

/* ========== create new topic ========== */
exports.createTopic = async (req, res) => {
  if (!req.session.userId) return res.redirect("/login");

  try {
    const { title, description, genre } = req.body;
    const newTopic = new Topic({
      title,
      description,
      genre,
      creatorId: req.session.userId,
      createdAt: new Date(),
    });
    const savedTopic = await newTopic.save();

    /* auto-subscribe creator */
    await new Subscription({
      userId: req.session.userId,
      topicId: savedTopic._id,
      createdAt: new Date(),
    }).save();

    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error: " + err.message);
  }
};

/* ========== topic detail ========== */
exports.getTopicById = async (req, res) => {
  try {
    const topicId = req.params.id;
    const topic = await Topic.findById(topicId);
    if (!topic) return res.status(404).send("Topic not found");

    /* stats: record view + emit event */
    await Topic.findByIdAndUpdate(topicId, { $inc: { viewCount: 1 } });
    eventBus.emit("topicViewed", topicId);

    const messages = await Message.find({ topicId })
      .populate("authorId", "username")
      .sort({ createdAt: -1 });

    /* check subscription */
    let isSubscribed = false;
    if (req.session.userId) {
      isSubscribed = !!(await Subscription.findOne({
        userId: req.session.userId,
        topicId,
      }));
    }

    const user = req.session.userId
      ? await require("../models/user").findById(req.session.userId)
      : null;

    res.render("topic-detail", {
      topic,
      description: topic.description,
      messages,
      user,
      isSubscribed,
      title: topic.title,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

/* ========== (un)subscribe ========== */
exports.subscribe = async (req, res) => {
  if (!req.session.userId) return res.redirect("/login");

  try {
    const topicId = req.params.id;
    const existing = await Subscription.findOne({
      userId: req.session.userId,
      topicId,
    });

    if (!existing) {
      await new Subscription({
        userId: req.session.userId,
        topicId,
        createdAt: new Date(),
      }).save();
    }
    res.redirect(req.query.returnTo || "/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.unsubscribe = async (req, res) => {
  if (!req.session.userId) return res.redirect("/login");

  try {
    await Subscription.findOneAndDelete({
      userId: req.session.userId,
      topicId: req.params.id,
    });
    res.redirect(req.query.returnTo || "/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

/* ========== subscription management page ========== */
exports.getSubscriptionManagement = async (req, res) => {
  if (!req.session.userId) return res.redirect("/login");

  try {
    const allTopics = await Topic.find().sort({ createdAt: -1 });

    /* ensure replyCount exists for seeded/older topics */
    for (const t of allTopics) {
      if (t.replyCount == null) {
        const rc = await Message.countDocuments({ topicId: t._id });
        await Topic.findByIdAndUpdate(t._id, { replyCount: rc });
        t.replyCount = rc;
      }
    }

    const subs = await Subscription.find({ userId: req.session.userId });
    const subIds = subs.map((s) => s.topicId.toString());

    const subscribedTopics = [];
    const availableTopics = [];

    for (const t of allTopics) {
      (subIds.includes(t._id.toString())
        ? subscribedTopics
        : availableTopics
      ).push(t);
    }

    const user = await require("../models/user").findById(req.session.userId);

    res.render("subscription-management", {
      user,
      subscribedTopics,
      availableTopics,
      title: "Manage Subscriptions",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

/* ---------- placeholder for any misc routes ---------- */
exports.placeholder = (req, res) =>
  res.status(501).send("Topic endpoint not implemented yet: " + req.path);
