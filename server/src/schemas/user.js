const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const users = new Schema({
    username: String,
    email: String,
    password: Buffer,
    salt: String
});

module.exports = mongoose.model('users', users);
