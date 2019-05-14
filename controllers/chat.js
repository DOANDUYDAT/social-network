const Conversation = require('../models/conversations'),
  Message = require('../models/message'),
  User = require('../models/user');

exports.getConversations = function (req, res, next) {
  const user = req.user;
  // Only return one message from each conversation to display as snippet
  Conversation.find({ participants: req.user.account })
    .select('_id participants message')
    .exec((err, conversations) => {
      if (err) throw err;

      // Set up empty array to hold conversations + most recent message
      let fullConversations = [];
      
      if (conversations.length !== 0) {
        conversations.forEach((conversation) => {
          let friendAccount = conversation.participants.find(participant => {
            return participant !== user.account;
          })
          // console.log(friend);
          User.findOne({ 'account': friendAccount })
            .select('name avatar')
            .exec((err, friend) => {
              if (err) throw err;
              Message.find({ conversationId: conversation._id })
                .sort('-createdAt')
                .limit(1)
                .populate({
                  path: 'author',
                  select: 'name.first name.last account'
                })
                .exec((err, message) => {
                  if (err) throw err;
                  const timeOfMessage = convertDateAndTime(message[0].createdAt);
                  // console.log(message);
                  // console.log(timeOfMessage);
                  let conver = { owner: friend, message: message, timeOfMessage: timeOfMessage };
                  fullConversations.push(conver);
                  
                  // console.log(fullConversations);
                  if (fullConversations.length === conversations.length) {
                    // return res.status(200).render('pages/messages', {
                    //   user: req.user,
                    //   conversations: fullConversations
                    // })
                    req.fullConversations = fullConversations;
                    next();
                    // return res.status(200).json({
                    //   conversations: fullConversations,
                    //   // friend: friend
                    // });
                  }
                });
            })

        });
      } else {
        res.render('pages/messages', {
          user: req.user,
          conversations: fullConversations
        })
      }

    });
};

exports.getConversation = function (req, res, next) {
  console.log(req.params.conversationId);
  Message.find({ conversationId: req.params.conversationId })
    .select('createdAt body author')
    .sort('-createdAt')
    .populate({
      path: 'author',
      select: 'name.first name.last avatar account'
    })
    .exec((err, messages) => {
      // if (err) {
      //   res.send({ error: err });
      //   return next(err);
      // }
      if (err) throw err;
      
      messages.forEach(message => {
        message.timeOfMessage = convertDateAndTime(message.createdAt);
      })
      // console.log(messages);
      req.messages = messages;
      next();
    });
};

exports.newConversation = function (req, res, next) {
  console.log(req.params);
  console.log(req.body);
  // if (!req.params.recipient) {
  //   res.status(422).send({ error: 'Please choose a valid recipient for your message.' });
  //   return next();
  // }

  // if (!req.body.composedMessage) {
  //   res.status(422).send({ error: 'Please enter a message.' });
  //   return next();
  // }
  
  
  const conversation = new Conversation();

  conversation.participants = [req.user.account, req.body.recipient];
  

  conversation.save((err, newConversation) => {
    if (err) throw err;
    User.findOne({'account': req.user.account}, (err, user) => {
      user.roomChat.push(newConversation._id);
      user.save(err => {
        if (err) throw err;
      })
    })
    User.findOne({'account': req.body.recipient}, (err, user) => {
      user.roomChat.push(newConversation._id);
      user.save(err => {
        if (err) throw err;
      })
    })
    const message = new Message({
      conversationId: newConversation._id,
      body: '2 bạn đã là bạn bè',
      author: req.user._id
    });

    message.save((err, newMessage) => {
      if (err) {
        res.send({ error: err });
        return next(err);
      }
    });
    console.log(newConversation);
    // res.status(200).json({ message: 'Conversation started!', conversationId: newConversation._id });
  });
};

exports.sendReply = function (req, res, next) {
  const reply = new Message({
    conversationId: req.params.conversationId,
    body: req.body.composedMessage,
    author: req.user._id
  });
  
  reply.save((err, sentReply) => {
    if (err) {
      res.send({ error: err });
      return next(err);
    }

    return res.status(200).json({ message: 'Reply successfully sent!' });
  });
};




function convertDateAndTime(dateAndTime) {
  const now = new Date();
  const timeOfMessage = new Date(dateAndTime);
  const timeFollowSecond = Math.floor((now - timeOfMessage)/1000);
  const timeFollowMinute = Math.floor(timeFollowSecond/60);
  const timeFollowHour = Math.floor(timeFollowMinute/60);
  const timeFollowDay = Math.floor(timeFollowHour/24);
  if (timeFollowDay > 0) {
      return (timeFollowDay + ' days ago');
  } else if (timeFollowHour > 0) {
      return (timeFollowHour + ' hours ago');
  } else if (timeFollowMinute > 0) {
      return (timeFollowMinute + ' minutes ago');
  } else {
      return ('seconds ago');
  }
}