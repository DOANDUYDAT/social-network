const express = require('express');
const bodyParser = require('body-parser');

const middle = require('../middleware/middleware');
const ChatController = require('../controllers/chat');
const Message = require('../models/message');

const router = express.Router();

router.use(bodyParser.json());
router.use(middle.isLoggedIn);

// View messages to and from authenticated user
// router.get('/', ChatController.getConversations);

// Retrieve single conversation
router.get('/t/:conversationId', ChatController.getConversations, ChatController.getConversation, (req, res) => {
    res.render('pages/messages', {
        user: req.user,
        conversations: req.fullConversations,
        conversation: req.messages,
        conversationId: req.params.conversationId
    })
});

// Send reply in conversation
router.post('/t/:conversationId', ChatController.sendReply);

// Start new conversation
router.post('/t', ChatController.newConversation);


module.exports = router;


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}