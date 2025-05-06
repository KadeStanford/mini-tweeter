const Topic = require('../models/topic');
const Message = require('../models/message');
const Subscription = require('../models/subscription');

// Get new topic form
exports.getNewTopicForm = async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  
  try {
    // Find the user
    const user = await require('../models/user').findById(req.session.userId);
    
    res.render('new-topic', {
      user,
      title: 'Create New Topic'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Create a new topic
exports.createTopic = async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  
  try {
    const { title, description, genre } = req.body;
    
    // Create the new topic with creatorId field
    const newTopic = new Topic({
      title,
      description,
      genre,
      creatorId: req.session.userId, // Changed from createdBy to creatorId
      createdAt: new Date()
    });
    
    const savedTopic = await newTopic.save();
    
    // Auto-subscribe the creator
    const subscription = new Subscription({
      userId: req.session.userId,
      topicId: savedTopic._id,
      createdAt: new Date()
    });
    
    await subscription.save();
    
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error: ' + err.message);
  }
};

// Get topic by ID
exports.getTopicById = async (req, res) => {
  try {
    const topicId = req.params.id;
    
    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).send('Topic not found');
    }
    
    const messages = await Message.find({ topicId })
      .populate('authorId', 'username')
      .sort({ createdAt: -1 });
    
    // Check if user is subscribed to this topic
    let isSubscribed = false;
    if (req.session.userId) {
      const subscription = await Subscription.findOne({
        userId: req.session.userId,
        topicId
      });
      isSubscribed = !!subscription;
    }
    
    const user = req.session.userId ? 
      await require('../models/user').findById(req.session.userId) : 
      null;
    
    res.render('topic-detail', {
      topic,
      description: topic.description, 
      messages,
      user,
      isSubscribed,
      title: topic.title
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Subscribe to a topic
exports.subscribe = async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  
  try {
    const topicId = req.params.id;
    
    // Check if already subscribed
    const existingSubscription = await Subscription.findOne({
      userId: req.session.userId,
      topicId
    });
    
    if (!existingSubscription) {
      // Create new subscription
      const subscription = new Subscription({
        userId: req.session.userId,
        topicId,
        createdAt: new Date()
      });
      
      await subscription.save();
    }
    
    // Redirect back to the previous page or dashboard
    const redirectUrl = req.query.returnTo || '/dashboard';
    res.redirect(redirectUrl);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Unsubscribe from a topic
exports.unsubscribe = async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  
  try {
    const topicId = req.params.id;
    
    await Subscription.findOneAndDelete({
      userId: req.session.userId,
      topicId
    });
    
    // Redirect back to the previous page or dashboard
    const redirectUrl = req.query.returnTo || '/dashboard';
    res.redirect(redirectUrl);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Get subscription management page
exports.getSubscriptionManagement = async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  
  try {
    // Get all topics
    const allTopics = await Topic.find().sort({ createdAt: -1 });
    
    // Get user's subscribed topics
    const subscriptions = await Subscription.find({ userId: req.session.userId });
    const subscribedTopicIds = subscriptions.map(sub => sub.topicId.toString());
    
    // Split into subscribed and available
    const subscribedTopics = [];
    const availableTopics = [];
    
    for (const topic of allTopics) {
      if (subscribedTopicIds.includes(topic._id.toString())) {
        subscribedTopics.push(topic);
      } else {
        availableTopics.push(topic);
      }
    }
    
    const user = await require('../models/user').findById(req.session.userId);
    
    res.render('subscription-management', {
      user,
      subscribedTopics,
      availableTopics,
      title: 'Manage Subscriptions'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// For backward compatibility - placeholder for any other routes
exports.placeholder = (req, res) => {
  res.status(501).send("Topic endpoint not implemented yet: " + req.path);
};