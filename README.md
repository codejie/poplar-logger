# poplar
A lightweight logger with the following features, and inpired by [pino](https://github.com/pinojs/pino) project.
* all are objects
* with formatted-output script

# Install
```
npm install --save poplar-logger
```

# Usage
Default exports
```js
module.exports = Poplar;
module.exports.Logger = Logger;
module.exports.PrettyLogger = PrettyLogger;
module.exports.CacheLogger = CacheLogger;
```
* Poplar: the poplar class
* Logger: the default Logger instance
* PrettyLogger: the Logger instance with pretty outputing
* CacheLogger: the Logger instance with cache feature (faster)

Normally
```js
'use strict'

const Poplar = require('./');

const Logger = new Poplar({});

Logger.trace('should Not be outputed');
Logger.info('Hello world.');

Logger.setLevel('trace');
Logger.trace({Hello: 'world'});
```
```
[{"d":1529647390433,"l":5,"t":"poplar"},{"t":1,"o":"Hello world."}]
[{"d":1529647390435,"l":2,"t":"poplar"},{"t":2,"o":{"Hello":"world"}}]
```

Pretty
```js
'use strict'

const Poplar = require('./');

const Logger = new Poplar({
    pretty: true
});

Logger.trace('should Not be outputed');
Logger.info('Hello world.');

Logger.setLevel('trace');
Logger.trace({Hello: 'world'});
```
```
[2018-06-22T14:02:33.884+0800] INFO  poplar:
Hello world.
[2018-06-22T14:02:33.887+0800] TRACE poplar:
{
  "Hello": "world"
}
```

# Pretty by Pipe
```
>node example.js | poplar.js -l trace -c text
```
```
[2018-06-23T12:06:00.180+0800] INFO  poplar:
Hello world.
[2018-06-23T12:06:00.181+0800] TRACE poplar:
{
  "Hello": "world"
}
[un-poplar] this is NOT poplar log.
```
* -l: level, option

# Options

Default options
```js
const defaultOpts = {
    level: 'info',
    title: 'poplar',
    pretty: false,
    cache: 0,
    end: '\n',
    color: 'text',

    output: process.stdout,
    writeCallback: undefined
};
```
* level: logger level, supports 'trace', 'debug', 'info', 'warn', 'error' and 'fatal'
* title: logger title
* pretty: true indicates pretty formatted-outputing
* cache: the size of cache buffer, 0 indicates NO cache
* end: the end of log line
* color: the color for outputing, supports 'text' and 'level'
* output: the stream for outputing
* writeCallback: callback after log outputed

# Bechmarks

Basic
```
Log.Logger.info('Hello world');
Log.CacheLogger.info('Hello world');
Log.PrettyLogger.info('Hello world');
```
```
basic*10000: 599.941ms
cache*10000: 255.527ms
pretty*10000: 1517.173ms
```
Object
```
Log.Logger.info({"Hello": "world"});
Log.CacheLogger.info({"Hello": "world"});
Log.PrettyLogger.info({"Hello": "world"});
```
```
basic*10000: 686.868ms
cache*10000: 299.924ms
pretty*10000: 1578.868ms
```
Complex Array
```
const a = {
    b: 1,
    c: '1',
    d: {
        f: 2
    }
};
a.a = {
    m: 4,
    n: a.d
};
const array = [1, 'a', a, new Error('this is an error')];

Log.Logger.info(array);
Log.CacheLogger.info(array);
Log.PrettyLogger.info(array);
```
```
basic*10000: 1238.830ms
cache*10000: 717.515ms
pretty*10000: 3418.956ms
```


