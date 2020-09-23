const User = require('./schemas/user');

/**
 * Loads the respective user by  its id
 */
function getUser(req, res) {
    User.findById(req.query.id).then(
        (user) => {
            res.send({ id: user._id, username: user.username, email: user.email });
        },
        (err) => {
            console.error(err);
            return res.sendStatus(500);
        }
    );
}

/**
 * Validates if the given username is already used or not,
 * so duplicates are prevented
 */
function checkUsername(req, res) {
    if (!req.body || !Object.keys(req.body).length) {
        return res.sendStatus(500);
    }

    const queryObject = { username: req.body.username };

    if (req.body.id) {
        queryObject._id = { $ne: req.body.id };
    }

    User.findOne(queryObject).exec(function (err, user) {
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }

        res.send({ user: !!user });
    });
}

module.exports.checkUsername = checkUsername;
module.exports.getUser = getUser;
