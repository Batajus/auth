import { NextFunction, Request, Response } from 'express';

import express from 'express';
const router = express.Router();

import Role from './schemas/role';
import { IRole } from './schemas/role';

import User from './schemas/user';
import { IUser } from './schemas/user';

const base64url = require('base64url');
const crypto = require('crypto');

const ALGORITHM = 'HS256';
const ITERATIONS = 10000;

/**
 * Performs the login operation
 *
 * Creates a JWT, if the given username and password were correct
 */
function login(req: Request, res: Response) {
    if (!req.body || !Object.keys(req.body).length) {
        return res.sendStatus(500);
    }

    User.findOne({ username: req.body.username }).then(async (user) => {
        if (!user) {
            return res.sendStatus(401);
        }

        const hash = hashPassword(req.body.password, user.salt);
        if (Buffer.compare(hash, user.password) != 0) {
            return res.sendStatus(401);
        }

        let roles: IRole[] = [];
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
 * Registers a new user
 *
 * Returns an error, if either the username or the email is already taken
 *
 * Otherwise the user will be saved and logged in
 */
function registration(req: Request, res: Response) {
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
        const password = hashPassword(req.body.password, salt);

        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password,
            salt
        });

        return user.save().then(
            () => {
                const jwt = generateJWT(user);
                res.send({ id: user._id, jwt });
            },
            (err: Error) => {
                console.error(err);
                return res.sendStatus(500);
            }
        );
    });
}

/**
 * Loads all roles for the given user id
 */
export function getUserRoles(req: Request): Promise<IRole[]> {
    const id = getPayload(req).id;

    return User.findById(id).then(async (user) => {
        if (!user) {
            throw new Error(`Missing user for id ${id}`);
        }

        let roles: IRole[] = [];
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
export function reAuthoriatzion(req: Request, res: Response) {
    if (!req.query.id) {
        return res.sendStatus(500);
    }

    return User.findById(req.query.id).then((user) => {
        if (!user) {
            throw new Error(`Missing user for id ${req.params.id}`);
        }

        res.send({ jwt: generateJWT(user) });
    });
}

/**
 * Checks if the http request contains a valid authorization header
 */
export function verifyAuthorization(req: Request, res: Response, next: NextFunction) {
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
export function generateJWT(user: IUser): string {
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
 *
 * TODO Add valid typing for payload
 */
export function getPayload(req: Request): { id: string } {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new Error('Missing Authorization');
    }

    const [, token] = authHeader.split(' ');
    const [, payload, _] = token.split('.');

    return JSON.parse(base64url.decode(payload));
}

export function hashPassword(password: string, salt: string) {
    return crypto.pbkdf2Sync(password, salt, ITERATIONS, 256, 'sha256');
}
/**
 *
 */
export function validateJWT(jwt: string): boolean {
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
export function validateJSON(json: string): boolean {
    try {
        return !!JSON.parse(json);
    } catch (e) {
        return false;
    }
}

router.post('/auth/login', login);
router.put('/auth/registration', registration);
router.get('/auth/re-authorization', verifyAuthorization, reAuthoriatzion);

export default router;
