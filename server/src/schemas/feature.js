const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const feature = new Schema({
    name: String,
    description: String,
    url: String,
    activationKey: String
});

module.exports = mongoose.model('features', feature);
