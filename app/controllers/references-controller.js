const refrencesValidator = require('../validators/references-validator');
const ResponseMessage = require('../api-models/ResponseMessage');
const ResponseMessageType = require('../api-models/ResponseMessageType');
const ResponseResult = require('../api-models/ResponseResult');
const service = require('../services/ReferenceManagerService');

/**
 * Use this controller for getting reference list with offset and limit and query. Note that you must first authenticate the user.
 * @param {HttpRequest} req Request parameter from express
 * @param {HttpResponse} res Response parameter from express
 */
async function getReferences(req, res) {
    // Validate request params
    const { error, value } = refrencesValidator.optionalIdValidator(req.query.parentId);

    let response;
    let httpMethodCode;

    if (error) {
        const errors = [];
        error.details.forEach(err => {
            errors.push(
                new ResponseMessage({
                    eventId: -425,
                    type: ResponseMessageType.error,
                    message: err.message
                })
            );
        });

        // Presentation result
        response = new ResponseResult({
            success: false,
            messages: [errors]
        });
        httpMethodCode = 400;
    } else {
        // Send data to service
        const result = await service.getReferencesGuest(value);

        // Presentation result
        response = new ResponseResult(result);
        httpMethodCode = result.httpMethodCode;
    }

    // Sending the result
    res.status(httpMethodCode).send(response);
}

/**
 * Use this controller for finding a reference by id. Note that you must first authenticate the user.
 * @param {HttpRequest} req Request parameter from express
 * @param {HttpResponse} res Response parameter from express
 */
async function findReferenceById(req, res) {
    // Validate request params
    const { id } = req.params;
    const { error, value } = refrencesValidator.idValidator(id);

    let response;
    let httpMethodCode;

    if (error) {
        const errors = [];
        error.details.forEach(err => {
            errors.push(
                new ResponseMessage({
                    eventId: -426,
                    type: ResponseMessageType.error,
                    message: err.message
                })
            );
        });

        // Presentation result
        response = new ResponseResult({
            success: false,
            messages: [errors]
        });
        httpMethodCode = 400;
    } else {
        // Send data to service
        const result = await service.findReferenceByIdGuest(value);

        // Presentation response
        response = new ResponseResult(result);
        httpMethodCode = result.httpMethodCode;
    }

    // Sending the result
    res.status(httpMethodCode).send(response);
}

module.exports = {
    getReferences,
    findReferenceById
};
