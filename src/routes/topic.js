const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/login');
};

// IMPORTANT: Order matters for routes!
// 1. First, define specific routes

// Get form to create a new topic
router.get('/topic/new', isAuthenticated, topicController.getNewTopicForm);

// Create a new topic
router.post('/topic/create', isAuthenticated, topicController.createTopic);

// Subscribe to a topic
router.post('/topic/:id/subscribe', isAuthenticated, topicController.subscribe);

// Unsubscribe from a topic
router.post('/topic/:id/unsubscribe', isAuthenticated, topicController.unsubscribe);

// Subscription management page
router.get('/subscriptions', isAuthenticated, topicController.getSubscriptionManagement);

// Get topic by ID (must come after /topic/new)
router.get('/topic/:id', topicController.getTopicById);

// Remove the problematic catch-all route
// router.all("/topic/*", topicController.placeholder);

module.exports = router;