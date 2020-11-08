const mongoose = require('mongoose');

// Required? 
const user = require('./schemas/user');
const feature = require('./schemas/feature')

const mongoDB = 'mongodb://127.0.0.1/auth';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
