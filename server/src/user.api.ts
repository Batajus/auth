import { Request, Response } from 'express';
import express from 'express';

import User from './schemas/user';
import Feature from './schemas/feature';
import Role from './schemas/role';
import { IRole } from './schemas/role';
import { generateJWT, hashPassword } from './auth';

const router = express.Router();

/**
 * Changes the password of the user with the given id
 */
export function changePassword(req: Request, res: Response) {
    if (!req.body || !Object.keys(req.body).length) {
        return res.sendStatus(500);
    }

    return User.findById(req.params.id).then(
        (user) => {
            if (!user) {
                throw new Error(`Missing user for id ${req.params.id}`);
            }

            user.password = hashPassword(req.body.password, user.salt);
            user.save().then(
                () => {
                    // If the save operation was successful return a new token
                    const jwt = generateJWT(user);
                    res.send({ jwt });
                },
                (err) => {
                    console.error(err);
                    return res.sendStatus(500);
                }
            );
        },
        (err) => {
            console.error(err);
            return res.sendStatus(401);
        }
    );
}

/**
 * Loads the respective user by its id
 */
function getUsers(req: Request, res: Response) {
    return User.findById(req.params.id).then(
        async (user) => {
            if (!user) {
                throw new Error(`Missing user for id ${req.params.id}`);
            }

            let roles: IRole[] = [];
            if (user.roles && user.roles.length) {
                roles = await Role.find({ _id: { $in: user.roles } });
            }

            res.send({ id: user._id, username: user.username, email: user.email, roles, features: user.features });
        },
        (err: Error) => {
            console.error(err);
            return res.sendStatus(401);
        }
    );
}

function activateFeature(req: Request, res: Response) {
    return User.findById(req.params.id).then((user) => {
        if (!user) {
            throw new Error(`Missing user for id ${req.params.id}`);
        }

        user.features = req.body.features;

        return user.save().then(() => {
            res.send({});
        });
    });
}

function loadFeatures(req: Request, res: Response) {
    const ids = (req.query.ids as string).split(',');
    return Feature.find({ _id: { $in: ids } }).then((features) => {
        res.send(features);
    });
}

function deleteAccount(req: Request, res: Response) {
    return User.deleteOne({ _id: req.params.id })
        .then(() => {
            res.send({});
        })
        .catch((err: Error) => {
            console.error(err);
        });
}

router.get('/:id', getUsers);
router.delete('/:id', deleteAccount);
router.post('/:id/change-password', changePassword);
router.get('/:id/features', loadFeatures);
router.post('/:id/features', activateFeature);

export default router;
