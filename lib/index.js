'use strict'

const Util = require('util');

const Stringify = require('fast-safe-stringify');

const Levels = require('./levels');
const Types = require('./types');
const Helper = require('./helper');
const Placeholder = require('./placeholder');

const Decoder = require('./decoder');

const defaultOpts = {
    level: 'info',
    title: 'poplar',
    pretty: false,
    end: '\n',

    output: process.stdout,
    writeCallback: undefined
};

class Log {
    constructor (opts) {
        if (opts) {
            this.level =  Levels[opts.level || defaultOpts.level];
            this.title = opts.title || defaultOpts.title;
            this.pretty = opts.pretty || defaultOpts.pretty;
            this.end = opts.end || defaultOpts.end;

            this.output = opts.output || defaultOpts.output;
            this.writeCallback = opts.writeCallback || defaultOpts.writeCallback;
        } else {
            this.level = Levels[defaultOpts.level];
            this.title = defaultOpts.title;
            this.pretty = defaultOpts.pretty;
            this.end = defaultOpts.end;

            this.output = defaultOpts.output;
            this.writeCallback = defaultOpts.writeCallback;
        }

        if (this.pretty) {
            this.decoder = new Decoder();
        }

        this.addProtoFunction();
    }

    getLevel () {
        return this.level;
    }

    setLevel (level) {
        this.level = level;
    }

    addProtoFunction () {
        const keys = Object.keys(Levels);
        // const args = arguments;
        keys.map(key => {
            this[key] = function () {
                if (this.level > Levels[key]) {
                    return;
                }
                
                this.log(Levels[key], arguments);
            }
        });
    }

    analyseArgs (args) {
        const ret = [];
        let pos = 0;
        while (pos < args.length) {
            if (typeof args[pos] === 'string') {
                let count = Helper.countHolders(args[pos]);
                if (count > 0) {
                    count = ((count + pos)  < args.length) ? count : args.length - pos - 1;
                    const t = [];
                    for (let i = 0; i < count; ++ i) {
                        t.push(args[i + pos + 1]);
                    }
                    // ret.push(Util.format(args[pos], t));
                    ret.push(new Placeholder(args[pos], t));

                    pos += count + 1;

                    continue;
                }
            }
    
            ret.push(args[pos]);
            pos += 1;
        }

        return ret;
    }

    makeHeader (level) {
        return {
            time: Date.now(),
            level: level,
            title: this.title
        };
    }

    outputArgs (args) {
        const ret = [];
        args.forEach(arg => {
            if (typeof arg === 'string') {
                ret.push(this.stringToOutput(arg));
            } else if (typeof arg === 'number') {
                ret.push(this.numberToOutput(arg));
            } else {
                if (arg instanceof Error) {
                    ret.push(this.errorToOutput(arg));
                } else if (arg instanceof Array) {
                    ret.push(this.arrayToOutput(arg));
                } else if (arg instanceof Placeholder) {
                    ret.push(this.placeholderToOutput(arg));
                } else {
                    ret.push(this.objectToOutput(arg));
                }
            }
        });
        return ret;        
    }

    log (level, args) {
        const results = this.analyseArgs(args);

        // const ret = [this.makeHeader(level)];
        const ret = this.outputArgs(results);
        ret.unshift(this.makeHeader(level));
        // results.forEach(arg => {
        //     if (typeof arg === 'string') {
        //         ret.push(this.stringToOutput(arg));
        //     } else if (typeof arg === 'number') {
        //         ret.push(this.numberToOutput(arg));
        //     } else {
        //         if (arg instanceof Error) {
        //             ret.push(this.errorToOutput(arg));
        //         } else if (arg instanceof Array) {
        //             ret.push(this.arrayToOutput(arg));
        //         } else if (arg instanceof Placeholder) {
        //             ret.push(this.placeholderToOutput(arg));
        //         } else {
        //             ret.push(this.objectToOutput(arg));
        //         }
        //     }
        // });

        let line  = Stringify(ret) + this.end;

        if (this.pretty) {
            line = this.decoder.decode(line);
        }

        this.output.write(line, 'utf8', this.writeCallback);
    }

    stringToOutput (arg) {
        return {
            t: Types.string,
            o: arg
        };
    }

    numberToOutput (arg) {
        return {
            t: Types.number,
            o: arg
        };
    }

    errorToOutput (arg) {
        return {
            t: Types.error,
            o: {
                msg: arg.message,
                stack: arg.stack
            }
        };        
    }

    objectToOutput (arg) {
        return {
            t: Types.object,
            o: arg
        };
    }

    placeholderToOutput (arg) {
        return {
            t: Types.holder,
            o: arg.output()
        }
    }

    arrayToOutput (arg) {
        const ret = this.outputArgs(arg);

        return {
            t: Types.array,
            o: ret
        };
    }

}



module.exports = Log;