"use strict";

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require('http');
const authentication = require('./middlewares/authentication');
const cors = require('cors');

const compression = require('compression');
const cacheController = require('express-cache-controller');
const port = 3030;

const controller = require('./api/controller');
const secured = require('./api/secured');

const app = express();

app.use(compression());
app.use(cacheController({
    noStore: true
}));
app.use(cookieParser());
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false, limit:'50mb' }));
app.use('/api', authentication.midAuthentication(), controller.router);
app.use('/api', authentication.midAuthentication(), secured.router); // Esta va con real authentication

app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => {
    console.log('Up and Running');
});

process.on('uncaughtException', function (e) {
    console.log(e);
});
