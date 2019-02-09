import { default as Poplar, Logger, PrettyLogger, CacheLogger } from '../../'

const a = {
    b: 1,
    c: '1',
    d: {
        f: 2
    }
};

const array = [1, 'a', a, new Error('this is an error')];

// new Poplar instance
const logger = new Poplar({
    title: 'logger',
    level: 'info',
    pretty: true,
    color: 'text'
});

//logger
logger.info('This is a string.');

logger.info('the below should show an object structure:');
logger.trace(a);

logger.error(new Error('this is error.'));

logger.info('the next should show an array included number, string, object and error:');

logger.trace(array);

logger.info('the next should show a formatted string:')
logger.info('a = %d, b = %j', 1, a);

//Logger
Logger.info('This is a string.');

Logger.info('the below should show an object structure:');
Logger.trace(a);

Logger.error(new Error('this is error.'));

Logger.info('the next should show an array included number, string, object and error:');

Logger.trace(array);

Logger.info('the next should show a formatted string:')
Logger.info('a = %d, b = %j', 1, a);

//PrettyLogger
PrettyLogger.info('This is a string.');

PrettyLogger.info('the below should show an object structure:');
PrettyLogger.trace(a);

PrettyLogger.error(new Error('this is error.'));

PrettyLogger.info('the next should show an array included number, string, object and error:');
PrettyLogger.trace(array);

PrettyLogger.info('the next should show a formatted string:')
PrettyLogger.info('a = %d, b = %j', 1, a);






