'use strict'

const Poplar = require('./lib');

const Logger = new Poplar({});
const PrettyLogger = new Poplar({
    pretty: true
});
const CacheLogger = new Poplar({
    cache: 4096
});

module.exports = Poplar;
module.exports.Logger = Logger;
module.exports.PrettyLogger = PrettyLogger;
module.exports.CacheLogger = CacheLogger;