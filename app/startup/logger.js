const winston = require('winston');
const SocketTransport = require('../providers/SocketTransport');

const loggerFormat = winston.format.printf(info => {
    return `${info.timestamp} [${info.scope}] ${info.level}:\t${info.message}`;
});

const transports = {
    combinedLog: new winston.transports.File({
        level: 'silly',
        filename: 'combined.log',
        format: winston.format.combine(
            loggerFormat,
            winston.format.timestamp()
        ),
        dirname: '/var/log/we-will-guide-you/'
    }),
    errorLog: new winston.transports.File({
        level: 'error',
        filename: 'error.log',
        format: winston.format.combine(
            loggerFormat,
            winston.format.timestamp()
        ),
        dirname: '/var/log/we-will-guide-you/'
    }),
    logstashErrors: new winston.transports.File({
        level: 'error',
        format: winston.format.logstash(),
        filename: 'logstash-error.log',
        dirname: '/var/log/we-will-guide-you/'
    }),
    logstash: new winston.transports.File({
        level: 'silly',
        format: winston.format.logstash(),
        filename: 'logstash-combined.log',
        dirname: '/var/log/we-will-guide-you/'
    }),
    socket: server =>  new SocketTransport({ server })
};

const developmentTransports = {
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
        filename: 'combined.log'
    }),
    errorLog: new winston.transports.File({
        level: 'error',
        format: winston.format.combine(
            loggerFormat,
            winston.format.timestamp()
        ),
        filename: 'error.log'
    })
};

module.exports = (server) => {
    winston.configure({
        level: 'silly',
        levels: winston.config.npm.levels,
        format: winston.format.combine(
            loggerFormat,
            winston.format.timestamp()
        ),
        transports: [
            transports.combinedLog,
            transports.errorLog,
            transports.logstash,
            transports.logstashErrors,
            transports.socket(server)
        ]
    });

    if (process.env.NODE_ENV !== 'production') {
        winston.add(developmentTransports.console);
        winston.add(developmentTransports.combinedLog);
        winston.add(developmentTransports.errorLog);
    }
};
