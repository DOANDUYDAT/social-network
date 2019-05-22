const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');


const passport = require('./config/passport');
const configDB = require('./config/database');
const routes = require('./routes');
const Post = require('./models/post');


const port = 5000;

//init app
const app = express();

//connect to mongodb
mongoose.connect(configDB.url, { useNewUrlParser: true }).then(
  () => { console.log(`connected to ${configDB.url}`) },
  error => { throw error }
);
// serve static folder
app.use('/', express.static(path.join(__dirname, 'public')));




// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({ extended: false })); // get information from html forms, parse application/x-www-form-urlencoded
app.use(bodyParser.json());    // parse application/json

// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

// required for passport
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// khong lưu cache để  ngăn go back lại trang sau khi logout
// app.use(function (req, res, next) {
//   res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
//   next();
// });



const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

const io = require('socket.io')(server);

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/login');
}
// app.get('/chat', middle.isLoggedIn, (req, res) => {

//   res.render('pages/index', {
//     user: req.user
//   })
// });

app.use(function(req, res, next) {
  console.log(typeof req.next);

  next();
});

app.use('/', routes.home);
app.use('/messages', routes.messages);
app.use('/post', routes.posts);
app.use('/:userAccount', routes.users);



// Route not found (404)
app.use(function (req, res, next) {
  return res.status(404).render('pages/404');
});



let userOnline = [];
io.on('connection', function (socket) {
  
  socket.on('join', data => {
    socket.join(data.name);
    console.log(data.name);
  });

  socket.on('join user', data => {
    socket.join(data.name);
    
    // console.log(userOnline);
    if( userOnline.length > 0) {
      let flag = userOnline.find(user => {
        return user === data.name
      })
      if (!flag) {
        userOnline.push(data.name);
      }
    } else {
      userOnline.push(data.name);
    }
    io.emit('a user connected', {
      name: data.name
    })  
    socket.on('disconnect', function () {
      io.emit('a user disconnected', {
        name: data.name
      })
      userOnline = userOnline.filter(user => {
        return user !== data.name
      })
    });
    io.emit('list user online', {
      listUserOnline: userOnline
    })
    
  })
  // console.log(userOnline);

  socket.on('request friend', data => {
    socket.to(data.to).emit(data.to, {
      from: data.from,
      type: "request friend"
    })
  });
  socket.on('accept friend', data => {
    socket.to(data.to).emit(data.to, {
      from: data.from,
      type: 'accept friend',
    })
  })
  socket.on('message', data => {
    // console.log(data.conversationId);
    // console.log(data);
    socket.to(data.conversationId).emit('reply', {
      from: data.from,
      composedMessage: data.composedMessage,
      conversationId: data.conversationId
    })
  })

  socket.on('new comment', data => {
    Post.findOne({_id: data.postId })
      .populate({
        path: 'owner',
        select: 'account'
      })
      .exec((err, post) => {
        if(err) throw err;
        if (post.owner.account !== data.from) {
          socket.to(post.owner.account).emit(post.owner.account, {
            type: 'news',
            content: 'new comment',
            from: data.from,
            postId: data.postId
          })
        }
      })
  })
  // socket.on('disconnect', function () {
  //   io.emit('a user disconnected', {
  //     name: data.name
  //   })
  // });

});