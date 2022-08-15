const UpdateNotificationLevelApiModel = require('../api-models/user-setting/UpdateNotificationLevelApiModel');
const UpdateTwoStepLoginTypeApiModel = require('../api-models/user-setting/UpdateTwoStepLoginTypeApiModel');
const validators = require('../validators/manage-user-setting-validator');
const ResponseResult = require('../api-models/ResponseResult');
const ResponseMessage = require('../api-models/ResponseMessage');
const ResponseMessageType = require('../api-models/ResponseMessageType');
const ServiceResult = require('../api-models/ServiceResult');
const UserSettingManager = require('../services/UserSettingManagerService');
const User = require('../database/models/User');
const logger = require('../providers/logger-factory')('Service - UserSettingManager');

const userSettingManager = new UserSettingManager(User, logger);

async function getNotificationLevelByUserId(req, res) {
    const { id } = req.params;
    const { error, value } = validators.idValidators(id);

    let serviceResult;
    
    if(error) {
        const errors = [];

        error.details.forEach(err => {
            errors.push(new ResponseMessage({
                eventId: -323,
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
        // Send data to service
        serviceResult = await userSettingManager.getNotificationLevelByUserId(value);
    }

    // Presentation result
    let responseResult = new ResponseResult(serviceResult);

    res.status(serviceResult.httpMethodCode).send(responseResult);
}

async function updateNotificationLevelByUserId(req, res) {
    const { id } = req.params;
    // handle validation

    // map body to model
    let updateNotificationLevelApiModel = new UpdateNotificationLevelApiModel(req.body);

    updateNotificationLevelApiModel['id'] = id;

    const { error, value } = validators.updateNotificationLevelValidator(updateNotificationLevelApiModel);

    let serviceResult;


    if (error) {
        const errors = [];

        error.details.forEach(err => {
            errors.push(new ResponseMessage({
                eventId: -324,
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
        // Send Data to Service
        serviceResult = await userSettingManager.updateNotificationLevelByUserId(value);
    }

    // presentation result
    let responseResult = new ResponseResult(serviceResult);

    res.status(serviceResult.httpMethodCode).send(responseResult);
}

async function getTwoStepLoginTypeByUserId(req, res) {
    const { id } = req.params;
    const { error, value } = validators.idValidators(id);

    let serviceResult;
    
    if(error) {
        const errors = [];

        error.details.forEach(err => {
            errors.push(new ResponseMessage({
                eventId: -325,
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
        // Send data to service
        serviceResult = await userSettingManager.getTwoStepLoginTypeByUserId(value);
    }

    // Presentation result
    let responseResult = new ResponseResult(serviceResult);

    res.status(serviceResult.httpMethodCode).send(responseResult);
}

async function updateTwoStepLoginTypeByUserId(req, res) {
    let response;
    let httpMethodCode;
    const model = { ...req.body, id: req.user.id };

    // map body to model
    let updateTwoStepLoginTypeApiModel = new UpdateTwoStepLoginTypeApiModel(model);
    
    // handle validation
    const { error, value } = validators.updateTwoStepLoginTypeValidator(updateTwoStepLoginTypeApiModel);

    if (error) {
        const errors = [];

        error.details.forEach(err => {
            errors.push(new ResponseMessage({
                eventId: -326,
                type: ResponseMessageType.error,
                message: err.message
            }));
        });

        // presentation result
        response = new ResponseResult({
            success: false,
            messages: [errors]
        });
        httpMethodCode = 400;
    } else {
        // Send Data to Service
        const result = await userSettingManager.updateTwoStepLoginTypeByUserId(value);

        // presentation result
        response = new ResponseResult(result);
        httpMethodCode = result.httpMethodCode;
    }

    res.status(httpMethodCode).send(response);
}

module.exports = {
    getNotificationLevelByUserId,
    updateNotificationLevelByUserId,
    getTwoStepLoginTypeByUserId,
    updateTwoStepLoginTypeByUserId
};
