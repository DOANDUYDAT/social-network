const express = require('express');
const passport = require('../config/passport');
const User = require('../models/user');

const router = express.Router();



router.route('/login')
    .get((req, res, next) => {
        if (req.isUnauthenticated()){
            res.render('pages/login', {
                message: req.flash('loginMessage')
            });
        } else {
            res.redirect('/');
        }
        
    })
    // process the login form
    .post(passport.authenticate('local-login', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));


router.route('/signup')
    .get((req, res, next) => {
        if (req.isUnauthenticated()) {
            res.render('pages/signup', {
                message: req.flash('signupMessage')
            });
        } else {
            res.redirect('/');
        }
        
    })
    // process the signup form
    .post(passport.authenticate('local-signup', {
        successRedirect: '/login', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

router.get('/', isLoggedIn, (req, res) => {
    res.render('pages/newsfeeds', {
        user: req.user
    });
});


router.get('/friends', isLoggedIn, (req, res) => {
    res.render('pages/friends-newsfeed', {
        user: req.user
    });
});

router.get('/photos', isLoggedIn, (req, res) => {
    res.render('pages/photos', {
        user: req.user
    });
});

router.get('/messages', isLoggedIn, (req, res) => {
    res.render('pages/messages', {
        user: req.user
    });
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    res.redirect('/login');
});

router.get('/:userAccount', isLoggedIn, (req, res) => {
    let acc = req.params.userAccount;
    User.findOne({account: acc}, (err, user) => {
        if (user) {
            res.render('pages/timeline', {
                user: user
            })
        } else {
            res.render('pages/404');
        }
    });
    
});







// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}

module.exports = router;