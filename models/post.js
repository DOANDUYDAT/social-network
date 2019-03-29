const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const postSchema = new Schema({
    title: String,
    owner: String,
    body: String,
    image: [String],
    comments: [ObjectId],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    meta: {
        like: [String],
        dislike: [String]
    }
});

const Post = module.exports = mongoose.model('Post', postSchema);