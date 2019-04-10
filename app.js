const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');

const middle = require('./middleware/middleware');
const passport = require('./config/passport');
const configDB = require('./config/database');
const routes = require('./routes');


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
app.get('/chat', isLoggedIn, (req, res) => {

  res.render('pages/index', {
    user: req.user
  })
});

app.use('/', routes.home);
app.use('/:userAccount', middle.isLoggedIn , middle.getInformationOfUserAccount, routes.users);

// Route not found (404)
app.use(function (req, res, next) {
  return res.status(404).render('pages/404');
});


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
      return next();

  // if they aren't redirect them to the home page
  res.redirect('/login');
}
// lấy thông tin của userAccount tương ứng 
function getInformationOfUserAccount(req, res, next) {
  let acc = req.params.userAccount;
  console.log(req.params);
  User.findOne({ account: acc }, (err, user) => {
      if(err) throw err;
      if(user) {
          req.acc = user;
          next();
          
      } else {
          res.render('pages/404');
      }
      
  });
  
}


io.on('connection', (socket) => {


  // socket.on('disconnect', () => {
  console.log('a user connected');
  // console.log(socket.request);
  socket.on('sendUserName', data => {
    console.log(data);
  });
  // })

});
