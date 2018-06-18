'use strict'

// const Log = require('../lib');

const Logger = new (require('../lib'))({
    level: 'trace'
    // writeCallback: function () {
    //     console.log('wrote');
    // }
});

// Logger.__log(1, 2, 'c', {a: '888'}, new Error('0'));

const a = {
    b: 1,
    c: '1',
    d: {
        f: 2
    }
};

// Logger.__log(a);

a.a = {
    m: 4,
    n: a.d
};

// Logger.__log(a);

// Logger.__log('object = %j,%s', a, '1111', 4);

Logger.info('dddd', a);
Logger.trace('111');