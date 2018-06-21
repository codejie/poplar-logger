'use strict'

const Util = require('util');

const Parse = require('json-parse-safe');
const Stringify = require('fast-safe-stringify');

const Helper = require('./helper');
const Types = require('./types');

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
                            ret += this.options.end + this.elementToString(elements[i]);
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
        switch (element.t) {
            case Types.string:
                return this.outputAsString(element.o);
            case Types.object:
                return this.outputAsObject(element.o);
            case Types.error:
                return this.outputAsError(element.o);
            case Types.array:
                return this.outputAsArray(element.o);
            case Types.number:
                return this.outputAsNumber(element.o);
            case Types.holder:
                return this.outputAsHolder(element.o);
            default:
                return element.toString();
        }        
    }

    outputAsString (o) {
        return o;
    }

    outputAsObject (o) {
        return Stringify(o, null, 2);
    }

    outputAsError (o) {
        // return o.msg + this.options.end + o.stack;
        return o.stack;
    }

    outputAsNumber (o) {
        return o.toString();
    }

    outputAsArray (o) {
        let ret = '';
        o.forEach(ele => {
            ret += this.elementToString(ele) + this.options.end
        });
        return ret;
    }

    outputAsHolder (o) {
        return Util.format(o.format, ...o.args);
    }
}

module.exports = Decoder;
