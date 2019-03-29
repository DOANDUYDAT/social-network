const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    owner: String,
    body: String,
    comments: [{ body: String, date: Date }],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    meta: {
        like: [String],
        dislike: [String]
    }
});

const Comment = module.exports = mongoose.model('Comment', commentSchema);