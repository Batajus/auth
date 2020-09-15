const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const auth = require('./src/auth');

require('./src/db');

const PORT = 8080;

if (!process.env.JWT_SECRET) {
    throw new Error('MISSING_JWT_SECRET');
}

app.use(cors());

// Required! Otherwise the body of requests is empty
app.use(bodyParser.json());

/**
 *
 */
app.post('/login', auth.login);
app.post('/registration', auth.registration);

app.get('/user', auth.verifyAuthorization, (req, res) => {

    res.sendStatus(200);
})

/**
 *
 */
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
