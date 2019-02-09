'use strict'

const Poplar = require('./lib');

module.exports = Poplar;
module.exports.Logger = new Poplar();
module.exports.PrettyLogger = new Poplar({
    pretty: true,
    color: 'level'
});
module.exports.CacheLogger = new Poplar({
    cache: 4096
});