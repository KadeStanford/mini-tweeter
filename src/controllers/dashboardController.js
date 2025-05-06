const Topic = require('../models/topic');
const Message = require('../models/message');
const User = require('../models/user');
const UserPreference = require('../models/userpreference');
const Subscription = require('../models/subscription');
const eventBus = require('../eventbus');



eventBus.subscribe('newMessage', (message) => {
  console.log("New message received:", message);  // Log the new message to the console
  // Additional actions can be added here, such as updating the UI or notifying users
});

exports.accessTopic = async (req, res, next) => {
  try {
    const topicId = req.params.topicId;
    // Example: increment view counter
    // await Topic.findByIdAndUpdate(topicId, { $inc: { viewCount: 1 } });
    res.redirect(`/topic/${topicId}`); // or render a topic page
  } catch (err) {
    next(err);
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.redirect('/login');
    
    // Get the current user
    const user = await User.findById(userId);
    if (!user) {
      req.session.destroy();
      return res.redirect('/login');
    }
    
    // Get user preferences
    const userPrefs = await UserPreference.findOne({ userId });
    
    // Check if it's first login and should be redirected
    if (userPrefs && userPrefs.firstLogin) {
      return res.redirect('/genre-selection');
    }
    
    // Get user's preferred genres
    const preferredGenres = userPrefs ? userPrefs.genres : [];
    
    // Get user's subscriptions
    const subscriptions = await Subscription.find({ userId });
    const subscribedTopicIds = subscriptions.map(sub => sub.topicId);
    
    // Get subscribed topics with 2 most recent messages for each
    const subscribedTopicsWithMessages = [];
    
    for (const topicId of subscribedTopicIds) {
      const topic = await Topic.findById(topicId);
      if (topic) {
        const messages = await Message.find({ topicId })
          .populate('authorId', 'username')
          .sort({ createdAt: -1 })
          .limit(2);
          
        subscribedTopicsWithMessages.push({
          topic,
          messages
        });
      }
    }
    
    // Find recommended topics based on user preferences
    let recommendedTopics = [];
    if (preferredGenres && preferredGenres.length > 0) {
      // Get topics in preferred genres that user hasn't subscribed to
      recommendedTopics = await Topic.find({
        genre: { $in: preferredGenres },
        _id: { $nin: subscribedTopicIds }
      }).limit(5);
    }
    
    res.render('dashboard', {
      user,
      preferredGenres,
      subscribedTopicsWithMessages,
      recommendedTopics,
      topicsWithMessages: [], // For backward compatibility
      title: 'Dashboard'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading dashboard: ' + error.message);
  }
};
