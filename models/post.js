const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const postSchema = new Schema({
    title: String,
    owner: {
        type: ObjectId,
        ref: 'User'
    },
    body: String,
    images: [String],
    hidden: Boolean,
    meta: {
        like: [String],
        dislike: [String]
    }
},
    {
        timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
    });

const Post = module.exports = mongoose.model('Post', postSchema);