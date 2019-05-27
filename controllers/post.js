const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');


exports.getPosts = (req, res, next) => {

    const listOfPost = [];
    listOfPost.unshift(req.user._id);
    if (req.user.friendsList.length > 0) {
        req.user.friendsList.forEach(friend => listOfPost.push(friend.userId));
    }
    console.log(listOfPost);

    const fullPosts = [];
    let i = 0;
    listOfPost.forEach(onwerPost => {
        console.log(onwerPost);
        Post.find({
                owner: onwerPost
            })
            .sort('-createdAt')
            .limit(2)
            .populate({
                path: 'owner',
                select: 'name.first name.last avatar account'
            })
            .exec((err, posts) => {
                if (err) throw err;
                if (posts.length > 0) {
                    posts.forEach(post => {
                        const timePost = new Date(post.createdAt).toLocaleString();
                        const apost = {
                            post: post,
                            timePost: timePost
                        };
                        fullPosts.push(apost);
                        console.log(fullPosts);
                    })
                }

                i += 1;
                console.log(i);
                if (i === listOfPost.length) {
                    req.fullPosts = fullPosts;
                    res.render('pages/newsfeeds', {
                        user: req.user,
                        posts: req.fullPosts
                    })
                }
            })
    })
}

exports.getPost = (req, res, next) => {
    let acc = req.params.userAccount;
    let fullPosts = [];
    User.findOne({
        account: acc
    }, (err, user) => {
        if (err) throw err;
        if (user) {
            Post.find({
                    owner: user._id
                })
                .sort('-createdAt')
                .populate({
                    path: 'owner',
                    select: 'avatar name.first name.last account'
                })
                .exec((err, posts) => {
                    if (posts.length > 0) {
                        posts.forEach(post => {
                            // console.log(post);
                            const timePost = new Date(post.createdAt).toLocaleString();
                            const apost = {
                                post: post,
                                timePost: timePost
                            };
                            fullPosts.push(apost);

                        })
                    }
                    // console.log(fullPosts);
                    res.render('pages/timeline', {
                        acc: user,
                        user: req.user,
                        posts: fullPosts
                    })
                    // res.json(fullPosts);
                })
        } else {
            res.render('pages/404');
        }
    });
}

exports.getNumberLike = (req, res, next) => {
    const postId = req.query.postId;
    // console.log(req.params);
    // console.log(req.query);
    Post.findOne({
        _id: postId
    }, (err, post) => {
        if (err) throw err;
        // console.log(post);

        if (post.meta.like.length > 0) {
            const flag = post.meta.like.find(userLike => {
                return userLike === req.user.account;
            })
            if (flag) {
                res.json(post.meta.like);
            } else {
                post.meta.like.push(req.user.account);
                // post.meta.like = like;
                post.save(err => {
                    if (err) throw err;
                })
                res.json(post.meta.like)
            }
        } else {
            post.meta.like.push(req.user.account);
            // post.meta.like = like;
            post.save(err => {
                if (err) throw err;
            })
            res.json(post.meta.like);
        }
        // res.json(post);
    })
}

exports.getNumberDislike = (req, res, next) => {
    const postId = req.query.postId;
    // console.log(req.params);
    // console.log(req.query);
    Post.findOne({
        _id: postId
    }, (err, post) => {
        if (err) throw err;
        // console.log(post);

        if (post.meta.like.length > 0) {
            const flag = post.meta.dislike.find(userLike => {
                return userLike === req.user.account;
            })
            if (flag) {
                res.json(post.meta.dislike);
            } else {
                post.meta.dislike.push(req.user.account);
                // post.meta.like = like;
                post.save(err => {
                    if (err) throw err;
                })
                res.json(post.meta.dislike)
            }
        } else {
            post.meta.dislike.push(req.user.account);
            // post.meta.like = like;
            post.save(err => {
                if (err) throw err;
            })
            res.json(post.meta.dislike);
        }
        // res.json(post);
    })
}


exports.newPost = (req, res, next) => {
    const newPost = new Post();
    console.log(req.files);
    newPost.owner = req.user._id,
        newPost.body = req.body.texts,
        // newPost.images = [];
        req.files.forEach(file => {
            const path = '/uploads/posts/' + file.filename;
            newPost.images.push(path);
        })
    console.log(newPost);
    newPost.save(err => {
        if (err) throw err;
    })
    // console.log(req.files);
    res.redirect('/');
}


exports.newComment = (req, res, next) => {
    let newComment = new Comment();
    newComment.body = req.body.comment;
    newComment.owner = req.user._id;
    newComment.postId = req.body.postId;
    console.log(req.body);
    console.log(newComment);
    newComment.save((err, comment) => {
        if (err) throw err;
        res.end();
    })
}

exports.loadComments = (req, res, next) => {
    // console.log(req.params);
    const postId = req.params.postId;
    Comment.find({
            postId: postId
        })
        .populate({
            path: 'owner',
            select: 'avatar account name.first name.last'
        })
        .exec((err, comments) => {
            if (err) throw err;
            res.json(comments);
        })


}

exports.getParticularPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findOne({
            _id: postId
        })
        .populate({
            path: 'owner',
            select: 'name.first name.last avatar account'
        })
        .exec((err, post) => {
            if (err) throw err;
            Comment.find({
                    postId: postId
                })
                .populate({
                    path: 'owner',
                    select: 'avatar account name.first name.last'
                })
                .exec((err, comments) => {
                    if (err) throw err;
                    const timePost = new Date(post.createdAt).toLocaleString();
                    console.log(comments);
                    res.render('pages/post', {
                        comments: comments,
                        post: post,
                        timePost: timePost,
                        user: req.user
                    });
                })

        })
}