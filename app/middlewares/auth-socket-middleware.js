const jwt = require('jsonwebtoken');
const config = require('config');

const logger = require('../providers/logger-factory')(
    'middleware - auth socket'
);

module.exports = function(info, done) {
    const authorization = info.req.headers.authorization;

    if (!authorization || authorization.split(' ')[0] !== 'Bearer') {
        logger.warn('Tried to access log socket with no token.');
        return done(false);
    }

    try {
        const token = authorization.split(' ')[1];
        const decoded = jwt.verify(token, config.get('jwt.privateKey'));
        info.req.user = decoded;
        logger.info(`User ${decoded.id} connected to the log socket.`);
        done(true);
    } catch (err) {
        logger.warn(
            'Failed to decode provided token "invalid token" for log socket.'
        );
        done(false);
    }
};
