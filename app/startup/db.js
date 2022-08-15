const config = require('config');
const mongoose = require('mongoose');
const logger = require('../providers/logger-factory')('startup - database');

// mongoose unique index is not a constraint!!! we have to handle it ourselves.
const uniqueValidator = require('mongoose-unique-validator');
const redisMongoosePlugin = require('./redisMongoosePlugin');

// mongoose-exists: checks for existence of claimed ref ids
const exists = require('mongoose-exists');

mongoose.plugin(uniqueValidator, { message: 'IS_ALREADY_TAKEN' });
mongoose.plugin(redisMongoosePlugin);
mongoose.plugin(exists);

module.exports = async function() {
    const dbConfig = config.get('database');

    // Connecting to database
    mongoose
        .connect(dbConfig.connection, {
            useNewUrlParser: true
        })
        .then(() => logger.info(`Connnected to ${dbConfig.connection} ...`))
        .catch(err => logger.error(`Failed connecting to db > ${err} .`));
};
