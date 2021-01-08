const base64url = require('base64url');
const crypto = require('crypto');

const User = require('./schemas/user');
const Role = require('./schemas/role');

const ALGORITHM = 'HS256';
const ITERATIONS = 10000;

/**
 *
 */
function login(req, res) {
    if (!req.body || !Object.keys(req.body).length) {
        return res.sendStatus(500);
    }

    User.findOne({ username: req.body.username }).then(async (user) => {
        if (!user) {
            return res.sendStatus(401);
        }

        const hash = crypto.pbkdf2Sync(req.body.password, user.salt, ITERATIONS, 256, 'sha256');
        if (Buffer.compare(hash, user.password) != 0) {
            return res.sendStatus(401);
        }

        let roles = [];
        if (user.roles && user.roles.length) {
            roles = await Role.find({ _id: { $in: user.roles } });
        }

        const jwt = generateJWT(user);
        // TODO #9 - Use a generalized way to return the user 
        res.send({
            id: user._id,
            username: user.username,
            email: user.email,
            jwt,
            roles: roles,
            features: user.features
        });
    });
}

/**
 *
 */
function registration(req, res) {
    if (!req.body || !Object.keys(req.body).length) {
        return res.sendStatus(500);
    }

    const conflictPromises = Promise.all([
        User.findOne({ username: req.body.username }),
        User.findOne({ email: req.body.email })
    ]);

    return conflictPromises.then(([conflictName, conflictMail]) => {
        const errors = { username: !!conflictName, email: !!conflictMail };

        if (conflictName || conflictMail) {
            res.status(403);
            return res.send(errors);
        }

        const salt = crypto.randomBytes(256).toString('base64');
        const password = crypto.pbkdf2Sync(req.body.password, salt, ITERATIONS, 256, 'sha256');

        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password,
            salt
        });

        user.save(function (err) {
            if (err) {
                console.error(err);
                return res.sendStatus(500);
            }

            const jwt = generateJWT(user);

            res.send({ id: user._id, jwt });
        });
    });
}

function changePassword(req, res) {
    if (!req.body || !Object.keys(req.body).length) {
        return res.sendStatus(500);
    }

    return User.findById(req.params.id).then(
        (user) => {
            user.password = crypto.pbkdf2Sync(req.body.password, user.salt, ITERATIONS, 256, 'sha256');
            user.save(function (err) {
                if (err) {
                    console.error(err);
                    return res.sendStatus(500);
                }

                // If the password change was successful return a new token
                const jwt = generateJWT(user);
                res.send({ jwt });
            });
        },
        (err) => {
            console.error(err);
            return res.sendStatus(401);
        }
    );
}

/**
 * Loads all roles for the given user id
 */
function getUserRoles(req) {
    const id = getPayload(req).id;

    return User.findById(id).then(async (user) => {
        let roles = [];
        if (user.roles && user.roles.length) {
            roles = await Role.find({ _id: { $in: user.roles } });
        }

        return roles;
    });
}

/**
 * Verfies if the authorization of a user is still valid
 * If JWT is valid the expiration time is updated and will be returned
 */
function reAuthoriatzion(req, res) {
    if (!req.query.id) {
        return res.sendStatus(500);
    }

    return User.findById(req.query.id).then((user) => {
        res.send({ jwt: generateJWT(user) });
    });
}

/**
 * Checks if the http request contains a valid authorization header
 */
function verifyAuthorization(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.sendStatus(401);
    }

    const [, token] = authHeader && authHeader.split(' ');

    if (!token) {
        return res.sendStatus(401);
    }

    if (!validateJWT(token)) {
        return res.sendStatus(401);
    }

    next();
}

/**
 * Generates a valid JSON Web Token
 */
function generateJWT(user) {
    const header = {
        alg: ALGORITHM,
        typ: 'JWT'
    };

    const payload = {
        auth_time: Date.now(),
        exp: Date.now() + 30 * 60 * 1000,
        nickname: user.username,
        id: user._id
    };

    const preSignature = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;

    const signature = crypto.createHmac('sha256', process.env.JWT_SECRET).update(preSignature).digest('hex');

    return `${preSignature}.${signature}`;
}

/**
 * Decodes the payload of the received JWT
 */
function getPayload(req) {
    const authHeader = req.headers.authorization;
    const [, token] = authHeader && authHeader.split(' ');

    const [, payload, _] = token.split('.');

    return JSON.parse(base64url.decode(payload));
}

/**
 *
 */
function validateJWT(jwt) {
    const splittedJWT = jwt.split('.');

    if (splittedJWT.length !== 3) {
        return false;
    }

    let [header, payload, signature] = splittedJWT;

    // Invalidate the JWT if the header and payload are not valid JSON's
    if (!validateJSON(base64url.decode(header)) || !validateJSON(base64url.decode(payload))) {
        return false;
    }

    // Deny access if another algorithm is used
    if (JSON.parse(base64url.decode(header)).alg !== ALGORITHM) {
        return false;
    }

    // Invalidate the JWT if the token is expired
    const claims = JSON.parse(base64url.decode(payload));
    if (Date.now() > claims.exp) {
        return false;
    }

    const checkSignature = crypto
        .createHmac('sha256', process.env.JWT_SECRET)
        .update(`${header}.${payload}`)
        .digest('hex');

    if (checkSignature !== signature) {
        return false;
    }

    return true;
}

/**
 * Validates if the given string is a valid JSON
 */
function validateJSON(json) {
    try {
        return !!JSON.parse(json);
    } catch (e) {
        return false;
    }
}

module.exports.login = login;
module.exports.registration = registration;
module.exports.verifyAuthorization = verifyAuthorization;
module.exports.reAuthoriatzion = reAuthoriatzion;
module.exports.changePassword = changePassword;
module.exports.getUserRoles = getUserRoles;
