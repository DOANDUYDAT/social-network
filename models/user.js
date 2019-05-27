const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new Schema({
    password: String,
    name: {
        first: String,
        last: String
    },
    account: String,
    email: String,
    DOB: {
        day: Number,
        month: String,
        year: Number
    },
    job: {
        type: String,
        default: 'Student'
    },
    about: String,
    gender: String,
    address: {
        city: String,
        country: String
    },
    roomChat: [{
        type: ObjectId,
        ref: 'Conversation'
    }],
    requestFriends: [{
        userId: { type: ObjectId, ref: 'User' },
        friendName: String,
        friendAccount: String,
        friendAvatar: String
    }],
	friendsList: [{
        userId: { type: ObjectId, ref: 'User' },
        friendName: String,
        friendAccount: String,
        friendAvatar: String
    }],
    notifications: [String],
    posts: [ObjectId],
    albums: [ObjectId],
    avatar: {
        type: String,
        default: '/images/avatar-default.png'
    },
    background: {
        type: String,
        default: '/images/background-default.jpg'
    },
});




// methods ======================
// generating a hash
userSchema.methods.generateHash = function (password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

const User = module.exports = mongoose.model('User', userSchema);




