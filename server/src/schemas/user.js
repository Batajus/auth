const mongoose = require('mongoose');
const role = require('./role')

const Schema = mongoose.Schema;

const user = new Schema({
    username: String,
    email: String,
    password: Buffer,
    salt: String,
    roles: [mongoose.ObjectId]
});

module.exports = mongoose.model('users', user);
