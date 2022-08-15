const websiteSettingManagerValidator = require('../validators/website-setting-manager-validator');
const ServiceResult = require('../api-models/ServiceResult');
const ResponseMessage = require('../api-models/ResponseMessage');
const ResponseMessageType = require('../api-models/ResponseMessageType');
const ResponseResult = require('../api-models/ResponseResult');

// API Models
const UpdateWebsiteSettingAdminApiModel = require('../api-models/website-setting/UpdateWebsiteSettingAdminApiModel');

// Service functions
const websiteSettingManager = require('../services/website-setting-manager-service');

async function getWebsiteSetting(req, res) {
    let result = await websiteSettingManager.getWebsiteSetting();

    const responseResult = new ResponseResult(result);

    res.status(result.httpMethodCode).send(responseResult);
}

async function updateWebsiteSetting(req, res) {
    const { error, value } = websiteSettingManagerValidator.updateWebsiteSettingValidator(req.body);

    let serviceResult;

    if (error) {
        const errors = [];

        error.details.forEach(err => {
            errors.push(
                new ResponseMessage({
                    eventId: 208,
                    type: ResponseMessageType.error,
                    message: err.message
                })
            );
        });

        serviceResult = new ServiceResult({
            success: false,
            httpMethodCode: 400,
            messages: [errors]
        });
    } else {
        // Send data to service
        const updateWebsiteSettingAdminApiModel = new UpdateWebsiteSettingAdminApiModel(value);
        serviceResult = await websiteSettingManager.updateWebsiteSetting(updateWebsiteSettingAdminApiModel);
    }

    const responseResult = new ResponseResult(serviceResult);

    res.status(serviceResult.httpMethodCode).send(responseResult);
}

module.exports = {
    getWebsiteSetting,
    updateWebsiteSetting
};
