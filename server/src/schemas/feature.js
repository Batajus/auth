const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const feature = new Schema({
    name: String,
    shortDescription: String,
    description: String,
    url: String,
    activationKey: String,
    navigable: { type: Boolean, default: true }
});

module.exports = mongoose.model('features', feature);
