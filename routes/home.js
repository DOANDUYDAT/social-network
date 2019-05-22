const express = require('express');
const bodyParser = require('body-parser');
const multer = require('../config/multer');

const middle = require('../middleware/middleware');
const ChatController = require('../controllers/chat');
const postController = require('../controllers/post');

const passport = require('../config/passport');
const User = require('../models/user');
const Conversation = require('../models/conversations');

const router = express.Router();

router.use(bodyParser.json());

router.route('/login')
    .get((req, res, next) => {
        if (req.isUnauthenticated()) {
        res.render('pages/login', {
            message: req.flash('loginMessage')
        });
        } 
        else {
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

// router.get('/', isLoggedIn, postController.getPosts, (req, res) => {
//     res.render('pages/newsfeeds', {
//         user: req.user,
//         posts: req.fullPosts
//     })
// });

router.get('/', isLoggedIn, postController.getPosts);

router.get('/search', isLoggedIn, (req, res) => {
    let userAccount = req.user.account;
    User.find({ account: { $ne: userAccount } }, "name", (err, result) => {
        if (err) throw err;
        res.status(200).json(result);
    });
});

router.get('/search/top/', isLoggedIn, (req, res) => {
    let keys = req.query.keys;
    console.log(keys);
    if (keys) {
        keys = keys.split(' ');
        let regexString = "";

        for (let i = 0; i < keys.length; i++) {
            regexString += keys[i];
            if (i < keys.length - 1) regexString += '|';
        }

        let re = new RegExp(regexString, 'ig');
        console.log(re);
        let query = {
            $or: [
                { "name.first": re },
                { "name.last": re }
            ]

        }

        User.find(query, "account name avatar", (err, userResult) => {
            if (err) throw err;
            console.log(userResult);
            res.render('pages/search-result', {
                user: req.user,
                result: userResult
            });

        });
    } else {
        res.render('pages/404');
    }
});

router.post('/request-friend', isLoggedIn, (req, res) => {
    const acc = req.body.to;
    const userId = req.user.id;
    const fullNameOfNewFriend = req.user.name.first + ' ' + req.user.name.last;
    const newFriendAccount = req.user.account;
    const newFriendAvatar = req.user.avatar;
    // const newFriend = { fullNameOfNewFriend, newFriendAccount, newFriendAvatar };
    // console.log('new friend' +newFriend);
    User.findOne({ "account": acc }, (err, user) => {
        if (err) throw err;

        user.requestFriends.unshift({
            "userId": userId,
            "friendName": fullNameOfNewFriend,
            "friendAccount": newFriendAccount,
            "friendAvatar": newFriendAvatar
        });
        user.save((err) => {
            if (err) throw err;
            // console.log('request friend:' +user.requestFriends);

        })
    })
    res.status(200).end('send request successfull');
});

router.get('/friend', isLoggedIn, (req, res) => {
    const acc = req.query.key;
    User.findOne({ "account": acc }, (err, user) => {
        if (err) throw err;
        res.status(200).json(user);
    })
});

router.post('/add-friend', isLoggedIn, (req, res) => {
    const acc = req.user;
    const newFriend = req.body.friend;

    const answer = req.body.answer;
    if (answer === 'yes') {
        User.findOne({ 'account': acc.account }, (err, user) => {
            if (err) throw err;
            if (user.requestFriends !== null) {
                let friend = user.requestFriends.find(friend => {
                    return friend.friendAccount === newFriend;
                })

                user.requestFriends = user.requestFriends.filter(friend => {
                    return friend.friendAccount !== newFriend;
                })

                console.log(friend);
                user.friendsList.push({
                    "userId": friend.userId,
                    "friendName": friend.friendName,
                    "friendAccount": friend.friendAccount,
                    "friendAvatar": friend.friendAvatar
                });
                user.save((err) => {
                    if (err) throw err;
                    
                })
            }
        })
        const fullnameAcc = acc.name.first + ' ' + acc.name.last;
        User.findOne({ 'account': newFriend }, (err, user) => {
            if (err) throw err;
            user.friendsList.push({
                "userId": acc._id,
                "friendName": fullnameAcc,
                "friendAccount": acc.account,
                "friendAvatar": acc.avatar
            });
            user.save((err) => {
                if (err) throw err;
                res.json('accept add friend');
            })
        })
   
    }
    else if (answer === 'no') {
        User.findOne({ 'account': acc }, (err, user) => {
            if (err) throw err;
            user.requestFriends = user.requestFriends.filter(friend => {
                return friend.friendAccount !== newFriend;
            })
            user.save((err) => {
                if (err) throw err;
                res.json('cancel add friend');
            })
        })
        
    }
    
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

// router.get('/posts', isLoggedIn, postController.getPosts);

router.get('/messages', isLoggedIn, ChatController.getConversations, (req, res) => {
    res.status(200).render('pages/messages', {
        user: req.user,
        conversations: req.fullConversations,
        conversation: ''
    })
});

// router.get('/messages', isLoggedIn, (req, res) => {
//     res.render('pages/messages', {
//         user: req.user,
//         conversations: ['helo']
//     })
// });



// View messages to and from authenticated user
// router.get('/messages', isLoggedIn, ChatController.getConversations);

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    res.redirect('/login');
});

router.get('/:userAccount', isLoggedIn, postController.getPost);



// router.route('/:userAccount/timeline')
//     .get(isLoggedIn, getInformationOfUserAccount, (req, res, next) => {
//         console.log(req.params);
//         res.render('pages/timeline', {
//             user: req.user,
//             acc: req.acc
//         });
//     })
//     .post(multer.uploadAvatar, (req, res, next) => {

//     })

router.get('/:userAccount/about', isLoggedIn, getInformationOfUserAccount, (req, res) => {
    res.render('pages/about', {
        user: req.user,
        acc: req.acc
    });
});
router.post('/:userAccount/about', isLoggedIn, getInformationOfUserAccount, (req, res) => {
    User.findOne({ email: req.user.email }, (err, user) => {
        user.name.first = req.body.firstname;
        user.name.last = req.body.lastname;
        user.DOB.day = req.body.day;
        user.DOB.month = req.body.month;
        user.DOB.year = req.body.year;
        user.address.city = req.body.city;
        user.address.country = req.body.country;
        user.gender = req.body.optgender;
        user.about = req.body.information;

        user.save(err => {
            if (err) throw err;
            res.redirect('/' + req.user.account + '/about');
        })
    })
});


router.post('/:userAccount/avatar', isLoggedIn, getInformationOfUserAccount, multer.uploadAvatar, (req, res) => {
    console.log(req.body);
    console.log(req.file);
    User.findOne({ email: req.user.email }, (err, user) => {
        if (err) throw err;
        if (req.file) {
            user.avatar = '/uploads/avatars/' + req.file.filename;
            user.save((err, user) => {
                if (err) throw err;
                res.redirect('/' + req.user.account);
            })
        } else {
            res.redirect('/' + req.user.account);
        }

    })
})


router.get('/:userAccount/change-password', isLoggedIn, getInformationOfUserAccount, (req, res) => {
    res.render('pages/change-password', {
        user: req.user,
        acc: req.acc,
        message: ''
    });
});

router.post('/:userAccount/change-password', isLoggedIn, getInformationOfUserAccount, (req, res) => {
    req.flash('errorConfirm', "Mật khẩu xác thực không đúng");
    req.flash('errorNewPass', "Mật khẩu mới đã được sử dụng trước đó");
    req.flash('errorOldPass', "Mật khẩu không đúng");
    req.flash('changeSuccess', "Mật khẩu đã được thay đổi");
    console.log(req.body);
    User.findOne({ email: req.user.email }, (err, user) => {
        if (err) throw err;
        if (!user.validPassword(req.body.password)) {
            res.render('pages/change-password', {
                user: req.user,
                acc: req.acc,
                message: req.flash("errorOldPass"),
            })
        } else {
            if (user.validPassword(req.body.newPassword)) {
                res.render('pages/change-password', {
                    user: req.user,
                    acc: req.acc,
                    message: req.flash("errorNewPass"),
                })
            } else {
                if (req.body.newPassword !== req.body.retypeNewPassword) {
                    res.render('pages/change-password', {
                        user: req.user,
                        acc: req.acc,
                        message: req.flash("errorConfirm"),
                    })
                } else {
                    // console.log(req.body.password);
                    user.password = user.generateHash(req.body.newPassword);
                    user.save((err, newUser) => {
                        if (err) throw err;
                        console.log(newUser);
                        res.render('pages/change-password', {
                            user: req.user,
                            acc: req.acc,
                            message: req.flash("changeSuccess"),
                        })
                    })

                }
            }
        }
    })
    // res.end();
});

router.get('/:userAccount/albums', isLoggedIn, getInformationOfUserAccount, (req, res) => {
    res.render('pages/albums', {
        user: req.user,
        acc: req.acc
    })
});

router.get('/:userAccount/friends', isLoggedIn, getInformationOfUserAccount, (req, res) => {
    res.render('pages/friends', {
        user: req.user,
        acc: req.acc
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

function getInformationOfUserAccount(req, res, next) {
    let acc = req.params.userAccount;
    console.log(req.params);
    User.findOne({ account: acc }, (err, user) => {
        if (err) throw err;
        if (user) {
            req.acc = user;
            next();

        } else {
            res.render('pages/404');
        }

    });

}

module.exports = router;