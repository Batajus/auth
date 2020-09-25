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

module.exports.getUser = getUser;
