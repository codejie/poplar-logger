'use strict'


const Bench = require('fastbench');

const Log = require('./');

const a = {
    b: 1,
    c: '1',
    d: {
        f: 2
    }
};
a.a = {
    m: 4,
    n: a.d
};
const array = [1, 'a', a, new Error('this is an error')];

const run = Bench([
    function basic (done) {
        for (let i = 0; i < 10; ++ i) {
            Log.Logger.info(array);
        }
        setImmediate(done);
    },
    function cache (done) {
        for (let i = 0; i < 10; ++ i) {
            Log.CacheLogger.info(array);
        }
        Log.CacheLogger.flush();
        setImmediate(done);
    },
    function pretty (done) {
        for (let i = 0; i < 10; ++ i) {
            Log.PrettyLogger.info(array);
        }
        setImmediate(done);
    }
], 10000);

run();