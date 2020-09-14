const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const base64url = require('base64url');
const crypto = require('crypto');

const db = require('./src/db');
const User = require('./src/schemas/user');

const PORT = 8080;
const ALGORITHM = 'HS256';
const ITERATIONS = 10000;

if (!process.env.JWT_SECRET) {
    throw new Error('MISSING_JWT_SECRET');
}

app.use(cors());

// Required! Otherwise the body of requests is empty
app.use(bodyParser.json());

/**
 *
 */
app.post('/login', (req, res) => {
    if (!req.body || !Object.keys(req.body).length) {
        return res.sendStatus(500);
    }

    User.findOne({ username: req.body.username }).exec(function (err, user) {
        const hash = crypto.pbkdf2Sync(
            req.body.password,
            user.salt,
            ITERATIONS,
            256,
            'sha256'
        );
        if (Buffer.compare(hash, user.password) != 0) {
            return res.sendStatus(403);
        }

        const jwt = generateJWT(req.body.username);
        res.send({ id: user._id, jwt });
    });
});

/**
 *
 */
app.post('/registration', (req, res) => {
    if (!req.body || !Object.keys(req.body).length) {
        return res.sendStatus(500);
    }

    const salt = crypto.randomBytes(256).toString('base64');
    const password = crypto.pbkdf2Sync(
        req.body.password,
        salt,
        ITERATIONS,
        256,
        'sha256'
    );

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

        const jwt = generateJWT(user.username);

        res.send({ id: user._id, jwt });
    });
});

/**
 *
 */
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});

/**
 *
 */
function verifyAuthorization(req, res, next) {
    const authHeader = req.headers.authorization;
    const [, token] = authHeader && authHeader.split(' ');

    if (!token) {
        return res.sendStatus(401);
    }

    if (!validateJWT(token)) {
        return res.sendStatus(403);
    }

    req.user = '';
    next();
}

/**
 * Generates a valid JSON Web Token
 */
function generateJWT(username) {
    const header = {
        alg: ALGORITHM,
        typ: 'JWT'
    };

    const payload = {
        auth_time: Date.now(),
        exp: Date.now() + 30 * 60 * 1000,
        nickname: username
    };

    const preSignature = `${base64url(JSON.stringify(header))}.${base64url(
        JSON.stringify(payload)
    )}`;

    const signature = crypto
        .createHmac('sha256', process.env.JWT_SECRET)
        .update(preSignature)
        .digest('hex');

    return `${preSignature}.${signature}`;
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
    if (
        !validateJSON(base64url.decode(header)) ||
        !validateJSON(base64url.decode(payload))
    ) {
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
