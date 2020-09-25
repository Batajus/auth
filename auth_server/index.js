const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

// "Controllers"
const auth = require('./src/auth');
const user = require('./src/user');

require('./src/db');

const PORT = 8080;

if (!process.env.JWT_SECRET) {
    throw new Error('MISSING_JWT_SECRET');
}

app.use(cors());

// Required! Otherwise the body of requests is empty
app.use(bodyParser.json());

/**
 *  Handles authorization and registration
 */
app.post('/login', auth.login);
app.post('/registration', auth.registration);
app.get('/reauthorization', auth.verifyAuthorization, auth.reAuthoriatzion);

/**
 * Handles all request for/about users
 */
app.get('/user', auth.verifyAuthorization, user.getUser);

/**
 *  Start of the Express server
 */
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
