const Post = require('../models/post');
const User = require('../models/user');


exports.getPosts = (req, res, next) => {
    
    const listOfPost = [];
    listOfPost.unshift(req.user._id);
    req.user.friendsList.forEach(friend => listOfPost.push(friend.userId));
    
    console.log(listOfPost);

    const fullPosts = [];
    let i = 0;
    listOfPost.forEach( onwerPost => {
        console.log(onwerPost);
        Post.find({ owner: onwerPost })
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
                        // console.log(post);
                        const timePost = new Date(post.createdAt).toLocaleString();
                        const apost = { post: post, timePost: timePost };
                        fullPosts.push(apost);
                        // console.log(fullPosts);
                    })
                } 
                // else {
                //     let post = []
                //     fullPosts.push(post);
                // }
                console.log(i);
                i += 1;
                
                // console.log(listOfPost.length);
                console.log(fullPosts);
                if (i === listOfPost.length) {
                    req.fullPosts = fullPosts;
                    res.render('pages/newsfeeds', {
                        user: req.user,
                        posts: req.fullPosts
                    })
                    // res.json(fullPosts);
                }
                // i++;
            })
    })
}

exports.getPost = (req, res, next) => {

}

exports.newPost = (req, res, next) => {
    const newPost = new Post();
    console.log(req.user._id);
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