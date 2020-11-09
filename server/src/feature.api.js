const Feature = require('./schemas/feature');

/**
 * 
 */
function loadFeatures(req, res) {
    // TODO Implement Paging
    Feature.find({}).then(features => {
        res.status(200);
        res.send(JSON.stringify(features));
    });
}

/**
 * 
 */
function createFeature(req, res) {

}

module.exports.loadFeatures = loadFeatures;
module.exports.createFeature = createFeature;