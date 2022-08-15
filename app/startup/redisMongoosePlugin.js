const { redis, cacheLogger } = require('../providers/redis');

async function postSave(doc) {
    const { _id } = doc;
    if (_id) {
        if (redis.status === 'ready') {
            const redisKey = `_id:${_id}`;
            const docValue = JSON.stringify(doc);
            await redis.set(redisKey, docValue);
            cacheLogger.info(`Added _id:${_id} to cache`);
        } else {
            cacheLogger.warn('Cache not availbale. cache miss risk');
            // TODO: add the request to some kind of queue
        }
    }
}

async function preFindOneAndDelete() {
    const { _id } = this.getQuery();
    if (_id) {
        if (redis.status === 'ready') {
            const redisKey = `_id:${_id}`;
            await redis.del(redisKey);
            cacheLogger.info(`Flushed _id:${_id} from cache`);
        } else {
            cacheLogger.warn('Cache not availbale. lack of consistency risk');
            // TODO: add the request to some kind of queue
        }
    }
}

async function preFindOneAndUpdate() {
    const { _id } = this.getQuery();
    if (_id) {
        if (redis.status === 'ready') {
            const redisKey = `_id:${_id}`;
            await redis.del(redisKey);
            cacheLogger.info(`Flushed _id:${_id} from cache`);
        } else {
            cacheLogger.warn('Cache not availbale. lack of consistency risk');
            // TODO: add the request to some kind of queue
        }
    }
}

async function postFindOneAndUpdate(doc) {
    if (doc) {
        const { _id } = doc;
        if (_id) {
            if (redis.status === 'ready') {
                const redisKey = `_id:${_id}`;
                const docValue = JSON.stringify(doc);
                await redis.set(redisKey, docValue);
                cacheLogger.info(`Added _id:${_id} to cache`);
            } else {
                cacheLogger.warn(
                    'Cache not availbale. cache miss or lack of consistency risk'
                );
                // TODO: add the request to some kind of queue
            }
        }
    }
}

async function findByIdWithCache(_id) {
    if (redis.status === 'ready') {
        const redisKey = `_id:${_id}`;
        const docValue = await redis.get(redisKey);
        if (docValue) {
            cacheLogger.info(`Cache Hit, _id: ${_id}`);
            const doc = JSON.parse(docValue);
            return doc;
        } else {
            cacheLogger.info(`Cache Miss, _id: ${_id}`);
            const doc = await this.findById(_id).lean();
            const newDocValue = JSON.stringify(doc);
            await redis.set(redisKey, newDocValue);
            return doc;
        }
    } else {
        cacheLogger.warn('Cache not available');
        const doc = await this.findById(_id).lean();
        return doc;
    }
}

function customPlugin(schema) {
    schema.post('save', postSave);
    schema.post('findOneAndDelete', preFindOneAndDelete);
    schema.pre('findOneAndUpdate', preFindOneAndUpdate);
    schema.post('findOneAndUpdate', postFindOneAndUpdate);
    schema.statics.findByIdWithCache = findByIdWithCache;
}

module.exports = exports = customPlugin;
