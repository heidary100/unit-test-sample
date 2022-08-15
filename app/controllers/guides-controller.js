const validators = require('../validators/guides');

const ServiceResult = require('../api-models/ServiceResult');
const ResponseMessage = require('../api-models/ResponseMessage');
const ResponseMessageType = require('../api-models/ResponseMessageType');
const ResponseResult = require('../api-models/ResponseResult');

const GuideManager = require('../services/GuideManagerService');

async function findGuideById(req, res) {
    const { id } = req.params;
    const { error, value } = validators.idValidator(id);

    let result;

    if (error) {
        const errors = [];

        error.details.forEach(err => {
            errors.push(
                new ResponseMessage({
                    eventId: -1, // TODO
                    messageId: -1, // TODO
                    type: ResponseMessageType.error,
                    message: err.message
                })
            );
        });

        result = new ServiceResult({
            success: false,
            httpMethodCode: 400,
            messages: [errors]
        });
    } else {
        // Send data to service
        result = await GuideManager.findGuideById(value);
    }

    const responseResult = new ResponseResult(result);
    // presentation result

    res.status(result.httpMethodCode).send(responseResult);
}

module.exports = {
    findGuideById
};
