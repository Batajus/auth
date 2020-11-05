const Feature = require('./schemas/features');

function loadFeatures(req, res) {
    // TODO Implement Paging
    Feature.find({}).then(features => {
        res.status(200);
        res.send(JSON.stringify(features));
    });
}

module.exports.loadFeatures = loadFeatures;
