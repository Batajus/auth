const User = require('./schemas/user');

/**
 * Loads the respective user by  its id
 */
function getUsers(req, res) {
    User.findById(req.params.id).then(
        (user) => {
            res.send({ id: user._id, username: user.username, email: user.email });
        },
        (err) => {
            console.error(err);
            return res.sendStatus(401);
        }
    );
}

module.exports.getUsers = getUsers;
