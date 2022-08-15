const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('config');

const logger = require('../providers/logger-factory')('middleware - auth');
const ResponseResult = require('../api-models/ResponseResult');
const ResponseMessage = require('../api-models/ResponseMessage');
const ResponseMessageType = require('../api-models/ResponseMessageType');

/**
 * Use this function when you want to filter route accessing by roles after decoding user.
 * @param {DecodedToken} user User that requests access.
 * @param {[string]} roles Array of roles that can access.
 * @param {HttpResponse} res Http response object.
 * @param {Function} next Next middlware function for call. 
 */
function roleAccess(user, roles, res, next) {
    const totalLength = roles.length + user.roles.length;
    const unionLength = _.union(roles, user.roles).length;
    if (totalLength <= unionLength) {
        const response = new ResponseResult({
            success: false,
            messages: [
                new ResponseMessage({
                    eventId: -412,
                    messageId: 1,
                    type: ResponseMessageType.error,
                    message: 'ACCESS_DENIED'
                })
            ]
        });
        return res.status(403).send(response);
    }

    next();
}

/**
 * Use this middleware function when you want to authenticate and authorize.
 * @param {[string]} roles Array of roles that hvae access.
 */
module.exports = function(roles) {
    /**
     * @param {HttpRequest} req Http request object from express
     * @param {HttpResponse} res Http response object from express.
     * @param {Function} next Next middleware function for call.
     */
    return function(req, res, next) {
        const authorization = req.get('authorization');

        if (!authorization || authorization.split(' ')[0] !== 'Bearer') {
            logger.warn('Tried to access protected route with no token.');
            const response = new ResponseResult({
                success: false,
                messages: [
                    new ResponseMessage({
                        eventId: -410,
                        type: ResponseMessageType.error,
                        message: 'NO_TOKEN_PROVIDED'
                    })
                ]
            });
            return res.status(401).send(response);
        }

        try {
            const token = authorization.split(' ')[1];
            const decoded = jwt.verify(token, config.get('jwt.privateKey'));
            req.user = decoded;

            if (roles && roles.length > 0)
                roleAccess(decoded, roles, res, next);
            else next();
        } catch (err) {
            logger.warn('Failed to decode provided token "invalid token"');

            const response = new ResponseResult({
                success: false,
                messages: [
                    new ResponseMessage({
                        eventId: -411,
                        type: ResponseMessageType.error,
                        message: 'INVALID_TOKEN'
                    })
                ]
            });
            res.status(400).send(response);
        }
    };
};