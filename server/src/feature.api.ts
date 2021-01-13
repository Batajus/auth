import { Request, Response } from 'express';
import express from 'express';

const router = express.Router();

import Feature from './schemas/feature';

import { getUserRoles } from './auth';

/**
 * Load all stored features
 */
function loadFeatures(req: Request, res: Response) {
    // TODO Implement Paging
    return Feature.find({}).then((features) => {
        res.send(JSON.stringify(features));
    });
}

/**
 * Stores the newly created feature in the database
 */
function createFeature(req: Request, res: Response) {
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
function updateFeature(req: Request, res: Response) {
    // TODO extract all checks of this kind into a separate function
    if (!req.body || !Object.keys(req.body).length) {
        return res.sendStatus(500);
    }

    return Feature.findById(req.params.id)
        .then((feature) => {
            if (!feature) {
                throw new Error(`No Featur found for ${req.params.id}`);
            }

            Object.assign(feature, req.body);

            return feature.save().then(() => {
                res.send({ successful: true });
            });
        })
        .catch((err: Error) => {
            console.error(err);
            return res.sendStatus(500);
        });
}

/**
 * Deletes the given feature
 */
function deleteFeature(req: Request, res: Response) {
    return getUserRoles(req).then((roles) => {
        if (!roles.length || !roles.some((r) => r.name === 'admin')) {
            res.sendStatus(403);
            return;
        }

        return Feature.deleteOne({ _id: req.params.id }).then(
            () => {
                res.send({ successful: true });
            },
            (err: Error) => {
                console.error(err);
                res.sendStatus(501);
            }
        );
    });
}

router.get('/', loadFeatures);
router.put('/', createFeature);
router.post('/:id', updateFeature);
router.delete('/:id', deleteFeature);

export default router;
