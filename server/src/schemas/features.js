const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const features = new Schema({
    name: String,
    description: String,
    url: String
});

module.exports = mongoose.model('features', features);
