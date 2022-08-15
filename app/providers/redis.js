const Redis = require('ioredis');

// log
const loggerFactory = require('./logger-factory');
const cacheLogger = loggerFactory('Redis - Cache');

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const redis = new Redis(redisUrl);

let status = null;

redis.on('error', err => {
    if (err.code === 'ECONNREFUSED') {
        if (status === 'ready' || status === null) {
            status = 'connecting';
            cacheLogger.error(`Redis Cache connection error: ${err}`);
        }
    } else {
        cacheLogger.error(`Redis Cache error: ${err}`);
    }
});

redis.on('ready', () => {
    status = 'ready';
    cacheLogger.info('Conneted to redis server and ready');
});

module.exports = exports = { redis, cacheLogger };
