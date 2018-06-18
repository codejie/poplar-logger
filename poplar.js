#! /usr/bin/env node

'use strict'

// const Split2 = require('split2');

const Transform = require('stream').Transform;
const StringDecoder = require('string_decoder').StringDecoder;;

// function line(l) {
//     return l;
// }

// function copyStream () {
//     const stream = Split2(line);
//     const pipe = stream.pipe;
//     stream.pipe = function (dst, opts) {
//         return pipe.call(stream, dst, opts);
//     }
//     return stream;
// }

class CopyStream extends Transform {
    constructor (options) {
        super(options);

        this._last = '';
        this.decoder = new StringDecoder('utf8');
        this.matcher = /\r?\n/;
    }

    _transform (chunk, encoding, callback) {
        // this.mapper
        console.log(this._last);
        this._last += this.decoder.write(chunk);
        console.log('last = ' + this._last);
        const lines = this._last.split(this.matcher);

        let ret = '';
        let i = 0;
        // lines.forEach(line => {
        //     ret += (++ i) + '====' + line;
        // });

        console.log(lines);

        callback(null, ret);
    }
}


process.stdin.pipe(new CopyStream()).pipe(process.stdout);