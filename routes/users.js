const express = require('express');
const multer = require('../config/multer');
const User = require('../models/user');


const router = express.Router();




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