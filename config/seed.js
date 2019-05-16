const faker = require('faker');
const mongoose = require('mongoose');

const configDB = require('./database');

const Post = require('../models/post');
const User = require('../models/user');
const Image = require('../models/image');
const Comment = require('../models/comment');
const Coversations = require('../models/conversations');
const Message = require('../models/message');

//connect to mongodb
mongoose.connect(configDB.url, { useNewUrlParser: true }).then(
    () => { console.log(`connected to ${configDB.url}`) },
    error => { throw error }
);


// empty the collection first

Coversations.deleteMany()
    .then()
    .catch(err => console.log(err));
Message.deleteMany()
    .then()
    .catch(err => console.log(err));

// empty the collection first
// Post.deleteMany()
//     .then(() => {
//         const posts = [];

//         for (let i = 0; i < 5; i++) {
//             posts.push({
//                 title: faker.lorem.sentence(),
//                 body: faker.lorem.paragraph(),
//                 image: faker.image.imageUrl(),
//                 owner: faker.name.firstName() + ' ' + faker.name.lastName(),
//                 date: faker.date.past(),
//                 meta: {
//                     like: faker.random.number(150),
//                     dislike: faker.random.number(150)
//                 },

//             });
//         }
//         return Post.create(posts);
//     })
//     // .then(() => {
//     //     process.exit();
//     // })
//     .catch((e) => {
//         console.log(e);
//         process.exit(1);
//     });


// empty the collection first
// Image.deleteMany()
//     .then(() => {
//         const images = [];

//         for (let i = 0; i < 5; i++) {
//             images.push({
//                 title: faker.lorem.sentence(),
//                 url: faker.random.image(),
//                 owner: faker.name.firstName() + ' ' + faker.name.lastName(),
//                 date: faker.date.past(),
//             });
//         }
//         return Image.create(images);
//     })
//     // .then(() => {
//     //     process.exit();
//     // })
//     .catch((e) => {
//         console.log(e);
//         process.exit(1);
//     });


const newUser = new User();
const pass = newUser.generateHash('a');
// empty the collection first
User.deleteMany()
    .then(() => {
        const users = [];

        for (let i = 0; i < 10; i++) {
            let lname = faker.name.lastName();
            let fname = faker.name.firstName();
            let account = fname.toLowerCase().split(' ').join('.') + '.' + lname.toLowerCase().split(' ').join('.') + '.' + faker.random.number(100000);
            users.push({
                password: pass,
                name: {
                    first: fname,
                    last: lname,
                },
                account: account,
                email: faker.internet.email(),
                avatar: faker.image.avatar(),
                background: faker.image.nature(),
                gender: Math.random() < 0.5 ? 'Male' : 'Female',

            });
        }
        return User.create(users);
    })
    .then(() => {
        process.exit();
    })
    .catch((e) => {
        console.log(e);
        process.exit(1);
    });

// empty the collection first
// Comment.deleteMany()
//     .then(() => {
//         const comments = [];

//         for (let i = 0; i < 5; i++) {
//             comments.push({
//                 body: faker.lorem.paragraph(),
//                 owner: faker.name.firstName() + ' ' + faker.name.lastName(),
//                 date: faker.date.past(),
//                 meta: {
//                     like: faker.random.number(150),
//                     dislike: faker.random.number(150)
//                 },

//             });
//         }
//         return Comment.create(comments);
//     })
//     .then(() => {
//         process.exit();
//     })
//     .catch((e) => {
//         console.log(e);
//         process.exit(1);
//     });