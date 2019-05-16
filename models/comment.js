const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const commentSchema = new Schema({
    owner: {
        type: ObjectId,
        ref: 'User'
    },
    postId: ObjectId,
    body: String,
    comments: [{
        type: ObjectId,
        ref: 'Comment'
    }],
    hidden: Boolean,
    meta: {
        like: [String],
        dislike: [String]
    }
},
    {
        timestamps: true  // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
    });

const Comment = module.exports = mongoose.model('Comment', commentSchema);