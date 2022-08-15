const logger = require('../providers/logger-factory')('error handler');
const ServiceResult = require('../api-models/ServiceResult');
const ResponseMessage = require('../api-models/ResponseMessage');
const ResponseMessageType = require('../api-models/ResponseMessageType');

module.exports = (req, res, next) => {
    try {
        next();
    } catch(err) {
        logger.error(err);
        res.status(500).send(
            new ServiceResult({
            success: false,
            messages: [new ResponseMessage({
                eventId: 829,
                messageId: 82,
                type: ResponseMessageType.error,
                message: 'INTERNAL_ERROR'
            })]
        }));
    }
};