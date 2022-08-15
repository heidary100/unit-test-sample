const validators = require('../validators/auth-validator');
const ResponseMessage = require('../api-models/ResponseMessage');
const ResponseMessageType = require('../api-models/ResponseMessageType');
const ResponseResult = require('../api-models/ResponseResult');
const LoginUserGuestApiModel = require('../api-models/auth/LoginUserGuestApiModel');
const service = require('../services/AuthManagerService');

/**
 * Use this controller for providing a login with username and password.
 * @param {HttpRequest} req Request parameter from express
 * @param {HttpResponse} res Response parameter from express
 */
async function login(req, res) {
    // Map and validate request body
    const { error, value } = validators.usernameAndPassword(req.body);

    let response;
    let httpMethodCode;

    if (error) {
        const errors = [];
        error.details.forEach(err => {
            errors.push(
                new ResponseMessage({
                    eventId: -400,
                    messageId: 1,
                    type: ResponseMessageType.error,
                    message: err.message
                })
            );
        });

        response = new ResponseResult({
            success: false,
            messages: [errors]
        });
        httpMethodCode = 400;
    } else {
        const model = new LoginUserGuestApiModel({
            ...value,
            ip: req.connection.remoteAddress
        });

        // Send data to service
        const result = await service.loginWithUsername(model);

        // Presentation result
        response = new ResponseResult(result);
        httpMethodCode = result.httpMethodCode;
    }

    // Sending the result
    res.status(httpMethodCode).send(response);
}

module.exports = {
    login
};
