"use strict";

var config = require('./../app.config.json');
var bunyan = require('bunyan');

var log = bunyan.createLogger({ name: 'com.dontbudge.mongoservice' });

class MongoService {
    constructor () {
        this._db = require('mongoose');
        this._db.connect(config.mongo.host + ':' + config.mongo.port);
        this._User = require('./models/userModel.js');
    }

    get user () { return this._User; }
}