'use strict'

const Util = require('util');

const Parse = require('json-parse-safe');
const Stringify = require('fast-safe-stringify');

const Helper = require('./helper');
const Types = require('./types');

const UNDEF_OUTPUT = '[null]';

const defaultOptions = {
    level: 0,
    matcher: /\r??\n/,
    end: '\n',
    color: false//'text'|'level'|false
}

class Decoder {
    constructor (opts) {

        // this.options = {
        //     matcher: /\r?\n/,
        //     end: '\n'
        // };

        this.options = defaultOptions;
        if (opts && opts.level) {
            this.options.level = Helper.toLevel(opts.level);
        }
        
        if (opts && opts.color) {
            this.options.color = opts.color;
        }

        this._last = '';
    }

    decode (line) {
        this._last += line;
        const lines = this._last.split(this.options.matcher);

        let ret = '';

        if (lines) {
            this._last = lines.pop();

            lines.forEach(line => {
                const elements = Parse(line).value;
                if (elements && (elements instanceof Array) && elements.length > 0) {
                    if (elements[0].d && elements[0].l && elements[0].t) {
                        if (elements[0].l >= this.options.level) {
                            ret += this.tagsToString(elements[0]);
                            for (let i = 1; i < elements.length; ++ i) {
                                ret += this.options.end + this.elementToString(elements[i]);
                            }
                            ret += this.options.end;
                            if (this.options.color && this.options.color !== 'level') {
                                ret = Helper.colorWithLevel(ret, elements[0].l);
                            }
                        } else {
                            return;
                        }
                    } else {
                        ret += '[un-poplar]' + elements[0];
                        for (let i = 1; i < elements.length; ++ i) {
                            ret += '[un-poplar] ' + elements[i];
                        }
                        ret += this.options.end;
                    }
                } else {
                    ret += '[un-poplar] ' + line + this.options.end;
                }
            });
        }

        return ret;
    }

    tagsToString (element) {
        return '[' + Helper.toLocalTimeString(new Date(element.d)) + '] ' 
            + ((this.options.color && this.options.color === 'level') ? Helper.colorWithLevel(Helper.toLevelString(element.l), element.l) : Helper.toLevelString(element.l))
             + ' ' + element.t + ': ';
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
        return o || UNDEF_OUTPUT;
    }

    outputAsObject (o) {
        return (o ? Stringify(o, null, 2) : UNDEF_OUTPUT);
    }

    outputAsError (o) {
        // return o.msg + this.options.end + o.stack;
        return (o ? o.stack : UNDEF_OUTPUT);
    }

    outputAsNumber (o) {
        return (o ? o.toString() : UNDEF_OUTPUT);
    }

    outputAsArray (o) {
        if (!o) {
            return UNDEF_OUTPUT;
        }
        let ret = '';
        o.forEach(ele => {
            ret += this.elementToString(ele) + this.options.end
        });
        return ret;
    }

    outputAsHolder (o) {
        if (!0) {
            return UNDEF_OUTPUT;
        }
        return Util.format(o.format, ...o.args);
    }
}

module.exports = Decoder;
