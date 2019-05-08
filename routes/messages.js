const express = require('express');
const bodyParser = require('body-parser');

const passport = require('../config/passport');
const Conversations = require('../models/conversations');
const Message = require('../models/message');

const router = express.Router();


//= ========================
  // Chat Routes
  //= ========================

  // Set chat routes as a subgroup/middleware to apiRoutes
  router.use('/chat', chatRoutes);

  // View messages to and from authenticated user
  router.get('/', requireAuth, ChatController.getConversations);

  // Retrieve single conversation
  router.get('/:conversationId', requireAuth, ChatController.getConversation);

  // Send reply in conversation
  router.post('/:conversationId', requireAuth, ChatController.sendReply);

  // Start new conversation
  router.post('/new/:recipient', requireAuth, ChatController.newConversation);