const validators = require('../validators/user-manager-validator');
const ServiceResult = require('../api-models/ServiceResult');
const ResponseMessage = require('../api-models/ResponseMessage');
const ResponseMessageType = require('../api-models/ResponseMessageType');
const ResponseResult = require('../api-models/ResponseResult');

// API Models
const AddUserAPIModel = require('../api-models/AddUserAPIModel');
const UpdateUserAPIModel = require('../api-models/UpdateUserAPIModel');
const QueryAPIModel = require('../api-models/QueryApiModel');

const UserManager = require('../services/UserManagerService');

async function getUsers(req, res) {
    const model = new QueryAPIModel(req.query);
    const { error, value } = validators.getUsersValidator(model);

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
        result = await UserManager.getUsers(value);
    }

    const responseResult = new ResponseResult(result);

    res.status(result.httpMethodCode).send(responseResult);
}

async function addUser(req, res) {
    // map body to model
    let model = new AddUserAPIModel(req.body);

    const { error, value } = validators.addUserValidator(model);

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
        result = await UserManager.addUser(value);
    }

    const responseResult = new ResponseResult(result);
    // presentation result

    res.status(result.httpMethodCode).send(responseResult);
}

async function getUserById(req, res) {
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
        result = await UserManager.getUserById(value);
    }

    const responseResult = new ResponseResult(result);
    // presentation result

    res.status(result.httpMethodCode).send(responseResult);
}

async function updateUserById(req, res) {
    const { id } = req.params;
    const model = new UpdateUserAPIModel(id, req.body);
    const { error, value } = validators.updateUserByIdValidator(model);

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
        result = await UserManager.updateUserById(value);
    }

    const responseResult = new ResponseResult(result);
    // presentation result

    res.status(result.httpMethodCode).send(responseResult);
}

async function delUserById(req, res) {
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
        result = await UserManager.delUserById(value);
    }

    const responseResult = new ResponseResult(result);
    // presentation result

    res.status(result.httpMethodCode).send(responseResult);
}

module.exports = {
    addUser,
    delUserById,
    getUserById,
    getUsers,
    updateUserById
};
