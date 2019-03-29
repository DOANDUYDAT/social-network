const express = require('express');
const multer = require('../config/multer');

const router = express.Router();



router.route('/timeline')
    .get( isLoggedIn, (req, res, next) => {
        res.render('pages/timeline', {
            user: req.user
        });
    })
    .post( isLoggedIn, multer.uploadAvatar, (req, res, next) => {

    })

router.get('/about', isLoggedIn, (req, res) => {
    res.render('pages/about', {
        user: req.user
    });
});

router.get('/change-password', isLoggedIn, (req, res) => {
    res.render('pages/change-password', {
        user: req.user
    });
});

router.get('/albums', isLoggedIn, (req, res) => {
    res.render('pages/albums', {
        user: req.user
    })
});

router.get('/friends', isLoggedIn, (req, res) => {
    res.render('pages/friends', {
        user: req.user
    })
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