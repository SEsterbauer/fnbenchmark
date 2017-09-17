'use strict';

const Promise = require('bluebird');
const logger = require('./logger');

module.exports = {
    bench: (fn, args) => {
        logger.time(fn.name);
        return Promise.resolve()
            .then(() => {
                return fn(...args);
            })
            .then(result => {
                logger.timeEnd(fn.name);
                logger.log('function result was', result);
            })
            .catch(error => {
                logger.error('Error during benchmark:', error);
            });
    },
    benchBatch: (fns) => {
        logger.time('benchBatch');
        return Promise.map(fns, fn => {
            logger.time(fn.fn.name);
            return Promise.resolve(fn.fn(...fn.args))
                .then(result => {
                    logger.timeEnd(fn.fn.name);
                    return result;
                });
        }, { concurrency: 1 })
            .then(results => {
                logger.timeEnd('benchBatch');
                logger.log('function results were', results.join(','));
            })
            .catch(error => {
                logger.error('Error during benchmark batch', error);
            });
    },
};
