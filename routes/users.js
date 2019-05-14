const express = require('express');
const multer = require('../config/multer');

const User = require('../models/user');
const middle = require('../middleware/middleware');

const router = express.Router();

router.use( middle.isLoggedIn ,middle.getInformationOfUserAccount);




router.get('/', (req, res) => {
    let acc = req.params.userAccount;
    User.findOne({ account: acc }, (err, user) => {
        if(err) throw err;
        if (user) {
            res.render('pages/timeline', {
                acc: user,
                user: req.user
            })
        } else {
            res.render('pages/404');
        }
    });
})

router.route('/timeline')
    .get((req, res, next) => {
        console.log(req.params);
        res.render('pages/timeline', {
            user: req.user,
            acc: req.acc
        });
    })
    .post(multer.uploadAvatar, (req, res, next) => {

    })

router.get('/about', (req, res) => {
    res.render('pages/about', {
        user: req.user,
        acc: req.acc
    });
});

router.get('/change-password', (req, res) => {
    res.render('pages/change-password', {
        user: req.user,
        acc: req.acc
    });
});

router.get('/albums', (req, res) => {
    res.render('pages/albums', {
        user: req.user,
        acc: req.acc
    })
});

router.get('/friends', (req, res) => {
    res.render('pages/friends', {
        user: req.user,
        acc: req.acc
    })
});



module.exports = router;


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}