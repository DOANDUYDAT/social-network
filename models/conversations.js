const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

// Schema defines how chat messages will be stored in MongoDB
const conversationSchema = new Schema({
  participants: [String],
});

const Conversation = module.exports = mongoose.model('Conversation', conversationSchema);