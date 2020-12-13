const User = require('./schemas/user');
const Role = require('./schemas/role');

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

            res.send({ id: user._id, username: user.username, email: user.email, roles });
        },
        (err) => {
            console.error(err);
            return res.sendStatus(401);
        }
    );
}

module.exports.getUsers = getUsers;
