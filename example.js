'use strict'

const Poplar = require('./');

const Logger = new Poplar({
    // pretty: true
});

Logger.trace('should Not be outputed');
Logger.info('Hello world.');

Logger.setLevel('trace');
Logger.trace({Hello: 'world'});

console.log('this is NOT poplar log.');

const child = Logger.child();
child.trace('child test.');