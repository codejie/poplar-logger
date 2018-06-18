'use strict'

const Parse = require('json-parse-safe');

const Helper = require('./helper');

class Decoder {
    constructor () {

        this.options = {
            // encoding: 'utf8',
            matcher: /\r?\n/,
            end: '\n'
        };

        this._last = '';
        // this.decoder = new StringDecoder(this.options.encoding);
    }

    decode (line) {
        this._last += line;//this.decoder.write(chunk);
        const lines = this._last.split(this.options.matcher);

        let ret = '';

        if (lines) {
            this._last = lines.pop();

            lines.forEach(line => {
                const elements = Parse(line).value;
                if (elements && (elements instanceof Array) && elements.length > 0) {
                    if (elements[0].time && elements[0].level && elements[0].title) {
                        ret += this.tagsToString(elements[0]);
                        for (let i = 1; i < elements.length; ++ i) {
                            ret += this.elementToString(elements[i]);
                        }
                    } else {
                        throw new Error('todo - 1');
                    }
                } else {
                    throw new Error('todo - 2');
                }
            });
        }

        return ret + this.options.end;
    }

    tagsToString (element) {
        return '[' + Helper.toLocalTimeString(new Date(element.time)) + '] ' + Helper.toLevelString(element.level) + ' ' + element.title + ': ';
    }

    elementToString (element) {

    } 
}

module.exports = Decoder;
