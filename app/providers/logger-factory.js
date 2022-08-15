const winston = require('winston');

module.exports = scope => {
    if (scope === 'test') {
        winston.configure({
            level: 'silly',
            levels: winston.config.npm.levels,
            format: winston.format.combine(
                loggerFormat,
                winston.format.timestamp()
            ),
            transports: [testTransports.combinedLog, testTransports.errorLog]
        });
    }

    scope = { scope };

    return {
        error: mess => winston.error(mess, scope),
        warn: mess => winston.warn(mess, scope),
        info: mess => winston.info(mess, scope),
        verbose: mess => winston.verbose(mess, scope),
        debug: mess => winston.debug(mess, scope),
        silly: mess => winston.silly(mess, scope)
    };
};

const loggerFormat = winston.format.printf((info) => {
    return `${info.timestamp} [${info.scope}] ${info.level}:\t${info.message}`;
});

const testTransports = {
    console: new winston.transports.Console({
        level: 'silly',
        format: winston.format.combine(
            winston.format.colorize(),
            loggerFormat,
            winston.format.timestamp()
        )
    }),
    combinedLog: new winston.transports.File({
        level: 'silly',
        format: winston.format.combine(
            loggerFormat,
            winston.format.timestamp()
        ),
        filename: 'combined.test.log'
    }),
    errorLog: new winston.transports.File({
        level: 'error',
        format: winston.format.combine(
            loggerFormat,
            winston.format.timestamp()
        ),
        filename: 'error.test.log'
    })
};
