const { update } = require('./schemas/feature');
const Feature = require('./schemas/feature');

/**
 *
 */
function loadFeatures(req, res) {
    // TODO Implement Paging
    Feature.find({}).then((features) => {
        res.send(JSON.stringify(features));
    });
}

/**
 * Stores the newly created feature in the database
 */
function createFeature(req, res) {
    // TODO extract all checks of this kind into a separate function
    if (!req.body || !Object.keys(req.body).length) {
        return res.sendStatus(500);
    }

    // Check for duplicate url
    // TODO implement a more specific check, since it could be only
    // an url part of longer url
    return Feature.findOne({ url: req.body.url }).then((existingFeature) => {
        if (existingFeature) {
        }

        const feature = new Feature({
            name: req.body.name,
            shortDescription: req.body.shortDescription,
            description: req.body.description,
            url: req.body.url,
            activationKey: req.body.activationKey,
            navigable: req.body.navigable
        });

        feature.save().then(() => {
            return res.send(JSON.stringify(feature));
        });
    });
}

/**
 * Updates existing feature
 */
function updateFeature(req, res) {
    // TODO extract all checks of this kind into a separate function
    if (!req.body || !Object.keys(req.body).length) {
        return res.sendStatus(500);
    }

    return Feature.findById(req.params.id)
        .then((feature) => {
            Object.assign(feature, req.body);

            feature.save().then(() => {
                res.send({ successful: trueF });
            });
        })
        .catch((err) => {
            console.error(err);
            return res.sendStatus(500);
        });
}

module.exports.loadFeatures = loadFeatures;
module.exports.createFeature = createFeature;
module.exports.updateFeature = updateFeature;
