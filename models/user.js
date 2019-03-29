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
    DOB: Date,
    gender: String,
    address: {
        city: String,
        country: String
    },
    friends: [ObjectId],
    posts: [ObjectId],
    albums: [ObjectId],
    avatar: String,
    background: String,
});




// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
     return bcrypt.compareSync(password, this.password);
};

const User = module.exports = mongoose.model('User', userSchema);