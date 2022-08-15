const ResponseResult = require('../api-models/ResponseResult');
const ResponseMessage = require('../api-models/ResponseMessage');
const ResponseMessageType = require('../api-models/ResponseMessageType');
const ServiceResult = require('../api-models/ServiceResult');

const validators = require('../validators/password-reset');

// Api Model
const ForgetPasswordApiModel = require('../api-models/ForgetPasswordApiModel');
const ResetPasswordApiModel = require('../api-models/ResetPasswordApiModel.js');

const PasswordResetManager = require('../services/PasswordResetManager');
const User = require('../database/models/User');

//RabbitmQ
const { rabbitMQPublisher, rabbitMQ } = require('../providers/rabbitmq.js');

//Logger
const loggerFactory = require('../providers/logger-factory');
const serviceLogger = loggerFactory('Service - PasswordReset');

const nodemailer = require('../providers/nodemailer');

const passwordResetManager = new PasswordResetManager({ User, nodemailer }, serviceLogger);

async function forgetPassword(req, res) {
    const model = new ForgetPasswordApiModel(req.body);
    const { error, value } = validators.forgetPasswordValidators(model);

    let serviceResult;

    if(error) {
        const errors = [];

        error.details.forEach(err => {
            errors.push(new ResponseMessage({
                eventId: 4,
                messageId: 1,
                type: ResponseMessageType.error,
                message: err.message
            }));
        });

        serviceResult = new ServiceResult({
            success: false,
            httpMethodCode: 400,
            messages: [errors]
        });
    } else {
        serviceResult = await passwordResetManager.forgetPassword(value);
    }

    const responseResult = new ResponseResult(serviceResult);

    res.status(serviceResult.httpMethodCode).send(responseResult);
}

async function resetPassword(req, res) {
    const { token } = req.params;
    const model = new ResetPasswordApiModel(token, req.body);
    const { error, value } = validators.resetPasswordValidators(model);

    let serviceResult;

    if(error) {
        const errors = [];

        error.details.forEach(err => {
            errors.push(new ResponseMessage({
                eventId: 4,
                messageId: 1,
                type: ResponseMessageType.error,
                message: err.message
            }));
        });

        serviceResult = new ServiceResult({
            success: false,
            httpMethodCode: 400,
            messages: [errors]
        });
    } else {
        // TODO Start queue
        // get value (object to json) and assert to queue
        // await rabbitMQPublisher('resetPasswordInfo', JSON.stringify(value));
        // TODO Get the value and put resetPassword function for callback parameter
        serviceResult = await passwordResetManager.resetPassword(value);
        await rabbitMQ('resetPasswordInfo', serviceResult);
        //
    }

    const responseResult = new ResponseResult(serviceResult);

    res.status(serviceResult.httpMethodCode).send(responseResult);
}

module.exports = {
    forgetPassword,
    resetPassword
};
