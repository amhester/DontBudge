"use strict";

var config = require('./../app.config.json');
var bunyan = require('bunyan');
var redis = require('redis');

var log = bunyan.createLogger({ name: 'com.dontbudge.redisService' });

class RedisService {
    constructor () {
        this._client = redis.createClient({ port: config.redis.port });
        this._listenToRedis();
    }

    _listenToRedis () {
        this._client.on("ready", function () {
            log.info('redis connection established.');
        });

        this._client.on("reconnecting", function (delay, attempt) {
            log.warn('Redis client attempting to reconnect, attempt #%s...', attempt);
        });

        this._client.on("error", function (err) {
            log.error(err);
        });
    }

    _tellRedisToShutUp () {
        this._client.off('ready');
        this._client.off('reconnecting');
        this._client.off('error');
        this._client.quit();
        this._client = null;
    }

    expire (key, time, callback) {
        this._client.expire(key, time, function (err, reply) {
            if(err) {
                log.warn(err);
                callback(err);
            } else {
                callback(null, reply);
            }
        });
    }

    exists (key, callback) {
        this._client.hexists(key, 'token', function (err, reply) {
            if(err) {
                log.warn(err);
                callback(err);
            } else {
                let exists = reply !== 0;
                callback(null, exists);
            }
        });
    }

    cacheToken (key, token, callback) {
        var self = this;
        self._client.hset(key, 'token', token, function (err, reply) {
            if(err) {
                log.warn(err);
                callback(err);
            } else {
                self._client.expires(key, 100, function (err2, reply2) {
                    if(err2) {
                        log.warn(err2);
                        callback(err2);
                    } else {
                        callback(null, { setReply: reply, expireReply: reply2 });
                    }
                });
            }
        });
    }

    getToken (key, callback) {
        this._client.hget(key, 'token', function (err, reply) {
            if(err) {
                log.warn(err);
                callback(err);
            } else {
                callback(null, reply);
            }
        });
    }
}