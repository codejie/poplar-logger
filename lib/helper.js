'use strict'

const Levels = require('./levels');

const Interps = ['%s', '%d', '%i', '%f', '%j', '%o', '%0'];

function countHolder (str, interp) {
    let ret = 0;
    let pos = 0;
    while (true) {
        pos = str.indexOf(interp, pos);
        if (pos >= 0) {
            ++ ret;
            pos += interp.length;
        } else {
            break;
        }
    }

    return ret;
}

function countHolders (str) {
    let ret = 0;
    for (let i = 0; i < Interps.length; ++ i) {
        ret += countHolder(str, Interps[i]);
    }

    return ret;
}

function leftPadZeros (number, size, sign) {
    const str = Math.abs(number) + '';
    return ((number >= 0) ? (sign ? '+' : '') : '-')
            + Math.pow(10, Math.max(0, size - str.length)).toString().substr(1) + str;
}

function toLocalTimeString (date) {
    return date.getFullYear() + '-' + leftPadZeros((date.getMonth() + 1), 2) + '-' + leftPadZeros(date.getDate(), 2)
            + 'T' + leftPadZeros(date.getHours(), 2) + ':' + leftPadZeros(date.getMinutes(), 2) + ':'+ leftPadZeros(date.getSeconds(), 2)
            + '.' + leftPadZeros(date.getMilliseconds(), 3) + toLocalTZString(date);
}

function toLocalTZString (date) {
    const tz = - date.getTimezoneOffset();
    return leftPadZeros(Math.floor(tz / 60), 2, true) + leftPadZeros(tz % 60, 2);
}

function toLevelString (level) {
    switch (level) {
        case Levels.trace:
            return 'TRACE';
        case Levels.debug:
            return 'DEBUG';
        case Levels.info:
            return 'INFO ';
        case Levels.warn:
            return 'WARN ';
        case Levels.error:
            return 'ERROR';
        case Levels.fatal:
            return 'FATAL';
        default:
            return 'UNKNW';
    }
}

function toLevel (str) {
    switch (str) {
        case 'TRACE':
        case 'trace':
            return Levels.trace;
        case 'DEBUG':
        case 'debug':
            return Levels.debug;
        case 'INFO':
        case 'info':
            return Levels.info;
        case 'WARN':
        case 'warn':
            return Levels.warn;
        case 'ERROR':
        case 'error':
            return Levels.error;
        case 'FATAL':
        case 'fatal':
            return Levels.fatal;
        default:
            return Levels.info;
    }
}


module.exports.countHolder = countHolder;
module.exports.countHolders = countHolders;
module.exports.leftPadZeros = leftPadZeros;
module.exports.toLocalTimeString = toLocalTimeString;
module.exports.toLevelString = toLevelString;
module.exports.toLevel = toLevel;