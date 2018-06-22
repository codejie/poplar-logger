'use strict'

const FS = require('fs')
const dest = FS.createWriteStream('/dev/null')

const Poplar = require('../');

const Logger = new Poplar({
    output: dest
});

const CacheLogger = new Poplar({
    output: dest,
    cache: 4096
});

const PrettyLogger = new Poplar({
    output: dest,
    pretty: true
});

module.exports.Logger = Logger;
module.exports.CacheLogger = CacheLogger;
module.exports.PrettyLogger = PrettyLogger;