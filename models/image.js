const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const imageSchema = new Schema ({
    titile: String,
    url: String,
    owner: {
        type: ObjectId,
        ref: 'User'
    },
    date: { type: Date, default: Date.now },
    

});


const Image = module.exports = mongoose.model('Image', imageSchema);