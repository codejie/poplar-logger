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
    cache: 0,
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
            this.cache = opts.cache || defaultOpts.cache;
            this.end = opts.end || defaultOpts.end;

            this.output = opts.output || defaultOpts.output;
            this.writeCallback = opts.writeCallback || defaultOpts.writeCallback;
        } else {
            this.level = Levels[defaultOpts.level];
            this.title = defaultOpts.title;
            this.pretty = defaultOpts.pretty;
            this.cache = defaultOpts.cache;
            this.end = defaultOpts.end;

            this.output = defaultOpts.output;
            this.writeCallback = defaultOpts.writeCallback;
        }

        if (this.cache) {
            this.cacheBuffer = '';
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

    getPretty () {
        return this.pretty;
    }

    setPretty (pretty) {
        this.pretty = pretty; 
        if (this.pretty) {
            this.decoder = new Decoder();
        } else {
            this.decoder = null;
        }        
    }

    getTitle () {
        return this.title;
    }

    setTitle (title) {
        this.title = title;
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
        for (let i = 0; i < args.length; ++ i) {
            const arg = args[i];
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
        };
        return ret;        
    }

    log (level, args) {
        const results = this.analyseArgs(args);

        const ret = this.outputArgs(results);
        ret.unshift(this.makeHeader(level));

        let line  = Stringify(ret) + this.end;

        if (this.pretty) {
            line = this.decoder.decode(line);
        }

        if (this.cache) {
            this.cacheBuffer += line;
            if (this.cacheBuffer.length > this.cache) {
                this.objectToOutput(this.cacheBuffer, 'utf8', this.writeCallback);
                this.cacheBuffer = '';
            }
        } else {
            this.output.write(line, 'utf8', this.writeCallback);
        }
        // this.cache += line;
        // if (this.cache.length > 4096) {
        //     this.output.write(line, 'utf8', this.writeCallback);
        //     this.cache = '';
        // }
    }

    flush () {
        if (this.cache) {
            if (this.cacheBuffer.length > 0) {
                this.objectToOutput(this.cacheBuffer, 'utf8', this.writeCallback);
                this.cacheBuffer = '';
            }
        }
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