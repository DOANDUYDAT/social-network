const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const imageSchema = new Schema ({
    titile: String,
    url: String,
    owner: String,
    date: { type: Date, default: Date.now },
    album: String,

});


const Image = module.exports = mongoose.model('Image', imageSchema);