const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/login');
};

// Create a new message
router.post('/message/create', isAuthenticated, messageController.createMessage);

module.exports = router;