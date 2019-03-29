const express = require('express');


const router = express.Router();







//export this router to use in our index.js
module.exports = router;


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

   // if user is authenticated in the session, carry on 
   if (req.isAuthenticated())
       return next();

   // if they aren't redirect them to the home page
   res.redirect('/login');
}