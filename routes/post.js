const express = require('express');
const bodyParser = require('body-parser');

const middle = require('../middleware/middleware');
const postController = require('../controllers/post');
const Multer = require('../config/multer');
// const Message = require('../models/message');

const router = express.Router();

router.use(bodyParser.json());
router.use(middle.isLoggedIn);

//get some posts rencently
// router.get('/posts', postController.getPosts);

//get a particular post
router.get('/t/:postId', postController.getPost);

//create new post
router.post('/t', Multer.uploadPost, postController.newPost);


module.exports = router;