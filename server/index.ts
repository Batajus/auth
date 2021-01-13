import express from 'express';

const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

// "Controllers"
import UserRouter from './src/user.api';
import FeatureRouter from './src/feature.api';
import AuthRouter from './src/auth';
import { verifyAuthorization } from './src/auth';

require('./src/db');

const PORT = 8080;

if (!process.env.JWT_SECRET) {
    throw new Error('MISSING_JWT_SECRET');
}

app.use(cors());

// Required! Otherwise the body of requests is empty
app.use(bodyParser.json());

app.use('/auth', AuthRouter);
app.use('/users', verifyAuthorization, UserRouter);
app.use('/features', verifyAuthorization, FeatureRouter);

/**
 *  Start of the Express server
 */
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
