'use strict'

// const Log = require('../lib');

const Logger = new (require('../lib'))({
    level: 'trace',
    pretty: true,
    color: 'level'
    // writeCallback: function () {
    //     console.log('wrote');
    // }
});

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

Logger.info('This is a string.');

Logger.info('the below should show an object structure:');
Logger.trace(a);

Logger.error(new Error('this is error.'));

Logger.info('the next should show an array included number, string, object and error:');
const array = [1, 'a', a, new Error('this is an error')];
Logger.trace(array);

Logger.info('the next should show a formatted string:')
Logger.info('a = %d, b = %j', 1, a);