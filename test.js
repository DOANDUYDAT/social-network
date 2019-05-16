const Post = require('./models/post');

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

let fullPosts = [];
const configDB = require('./config/database');
mongoose.connect(configDB.url, { useNewUrlParser: true }).then(
    () => { console.log(`connected to ${configDB.url}`) },
    error => { throw error }
  );


Post.find((err, post) => {
    console.log(post);
})



            // console.log(fullPosts);


// Post.find( {owner: '5cdc1edaf17a841205edaf71'}, (err, post) => {
//     if(err) throw err;
//     console.log(post);
// })