const express   = require('express')
const bodyParser = require('body-parser')
const db             = require('./config/db');
const firebase       = require('firebase');

firebase.initializeApp({
  // "credentials": firebase.credentials.cert(db.credentials),
  "databaseURL": db.url
});

const app = express();

const port = 8000;

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

var database = firebase.app().database();

require('./app/routes')(app, database);

app.listen(port, () => {
});
