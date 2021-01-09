const User = require('./schemas/user');
const Role = require('./schemas/role');
const Feature = require('./schemas/feature');

/**
 * Loads the respective user by  its id
 */
function getUsers(req, res) {
    User.findById(req.params.id).then(
        async (user) => {
            let roles = [];
            if (user.roles && user.roles.length) {
                roles = await Role.find({ _id: { $in: user.roles } });
            }

            res.send({ id: user._id, username: user.username, email: user.email, roles, features: user.features });
        },
        (err) => {
            console.error(err);
            return res.sendStatus(401);
        }
    );
}

function activateFeature(req, res) {
    return User.findById(req.params.id).then((user) => {
        user.features = req.body.features;

        return user.save().then(() => {
            res.send({});
        });
    });
}

function loadFeatures(req, res) {
    const ids = req.query.ids.split(',');
    return Feature.find({ _id: { $in: ids } }).then((features) => {
        res.send(features);
    });
}

function deleteAccount(req, res) {
    return User.deleteOne({ _id: req.params.id })
        .then(() => {
            res.send({});
        })
        .catch((err) => {
            console.error(err);
        });
}

module.exports.getUsers = getUsers;
module.exports.activateFeature = activateFeature;
module.exports.deleteAccount = deleteAccount;
module.exports.loadFeatures = loadFeatures;
