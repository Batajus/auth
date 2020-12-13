const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

// "Controllers"
const auth = require('./src/auth');
const user = require('./src/user.api');
const feature = require('./src/feature.api');

require('./src/db');

const PORT = 8080;

if (!process.env.JWT_SECRET) {
    throw new Error('MISSING_JWT_SECRET');
}

app.use(cors());

// Required! Otherwise the body of requests is empty
app.use(bodyParser.json());

/**
 *  Handles authentication and registration
 */
app.post('/auth/login', auth.login);
app.put('/auth/registration', auth.registration);
app.get('/auth/re-authorization', auth.verifyAuthorization, auth.reAuthoriatzion);

/**
 * Handles all request for/about users
 */
app.get('/users/:id', auth.verifyAuthorization, user.getUsers);
app.post('/users/:id/change-password', auth.verifyAuthorization, auth.changePassword);

/**
 * Handles all request for/about features
 */
app.get('/features', auth.verifyAuthorization, feature.loadFeatures);
app.put('/features', auth.verifyAuthorization, feature.createFeature);
app.post('/features/:id', auth.verifyAuthorization, feature.updateFeature);

/**
 *  Start of the Express server
 */
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
