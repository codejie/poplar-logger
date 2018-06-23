#! /usr/bin/env node

'use strict'

const Transform = require('stream').Transform;
const StringDecoder = require('string_decoder').StringDecoder;;

const Decoder = require('./lib/decoder');

function arg (str) {
    return process.argv.indexOf(str) > 0;
}

function argParam (str) {
    const pos = process.argv.indexOf(str) + 1;
    if (pos > 1) {
        const ret = process.argv.length > pos && process.argv[pos];
        if (ret) {
            return ret;
        } else {
            throw new Error(str + ' need an argument');
        }
    }
    return undefined;
}

class CopyStream extends Transform {
    constructor (options) {
        super(options);

        const opts = {};
        opts.level = argParam('-l');

        this.stringDecoder = new StringDecoder('utf8');
        this.Decoder = new Decoder(opts);
    }

    _transform (chunk, encoding, callback) {
        const ret = this.Decoder.decode(this.stringDecoder.write(chunk));
        callback(null, ret);
    }
}

// function arg (s) {
//     return process.argv.indexOf(s) > 0
// }

// function argWithParam (s) {
//     if (!arg(s)) {
//       return
//     }
//     var argIndex = process.argv.indexOf(s) + 1
//     var argValue = process.argv.length > argIndex &&
//       process.argv[argIndex]
  
//     if (!argValue) {
//       throw new Error(s + ' flag provided without a string argument')
//     }
//     return argValue
//   }
  

process.stdin.pipe(new CopyStream()).pipe(process.stdout);