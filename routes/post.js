const express = require('express');
const bodyParser = require('body-parser');

const middle = require('../middleware/middleware');
const postController = require('../controllers/post');
const Multer = require('../config/multer');
// const Message = require('../models/message');
const Post = require('../models/post');

const router = express.Router();

router.use(bodyParser.json());
router.use(middle.isLoggedIn);

//get some posts rencently
// router.get('/posts', postController.getPosts);


//get number of like
router.get('/t/like/', postController.getNumberLike);


//get number of dislike
router.get('/t/dislike/', postController.getNumberDislike);

//new comment
router.post('/comment', postController.newComment);

// all comments of a post
router.get('/t/:postId/comments', postController.loadComments);

//particular post
router.get('/t/:postId', postController.getParticularPost);
//create new post
router.post('/t', Multer.uploadPost, postController.newPost);




module.exports = router;