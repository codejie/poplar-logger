'use strict'


const Bench = require('fastbench');

const Log = require('./');

const run = Bench([
    function basic (done) {
        for (let i = 0; i < 10; ++ i) {
            Log.Logger.info('Hello world');
        }
        setImmediate(done);
    },
    function cache (done) {
        for (let i = 0; i < 10; ++ i) {
            Log.CacheLogger.info('Hello world');
        }
        Log.CacheLogger.flush();
        setImmediate(done);
    },
    function pretty (done) {
        for (let i = 0; i < 10; ++ i) {
            Log.PrettyLogger.info('Hello world');
        }
        setImmediate(done);
    }
], 10000);

run();