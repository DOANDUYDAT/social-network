const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Schema defines how chat messages will be stored in MongoDB
const conversationSchema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

const Conversation = module.exports = mongoose.model('Conversation', conversationSchema);