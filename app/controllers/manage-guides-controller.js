const validators = require('../validators/manageGuides');

const ServiceResult = require('../api-models/ServiceResult');
const ResponseMessage = require('../api-models/ResponseMessage');
const ResponseMessageType = require('../api-models/ResponseMessageType');
const ResponseResult = require('../api-models/ResponseResult');

const AddGuideAPIModel = require('../api-models/guide/AddGuideAPIModel');
const UpdateGuideAPIModel = require('../api-models/guide/UpdateGuideAPIModel');
const QueryAPIModel = require('../api-models/QueryApiModel');

const GuideManager = require('../services/GuideManagerService');

async function addGuide(req, res) {
    let model = new AddGuideAPIModel({
        ...req.body,
        authorUserId: req.user.id
    });

    const { error, value } = validators.addGuideValidator(model);

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
        result = await GuideManager.addGuide(value);
    }

    const responseResult = new ResponseResult(result);
    // presentation result

    res.status(result.httpMethodCode).send(responseResult);
}

async function getGuides(req, res) {
    const model = new QueryAPIModel(req.query);
    const { error, value } = validators.getGuidesValidator(model);

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
        result = await GuideManager.getGuides(value);
    }

    const responseResult = new ResponseResult(result);

    res.status(result.httpMethodCode).send(responseResult);
}

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

async function updateGuideById(req, res) {
    const { id } = req.params;
    const model = new UpdateGuideAPIModel(id, req.body);
    const { error, value } = validators.updateGuideByIdValidator(model);

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
        result = await GuideManager.updateGuideById(value);
    }

    const responseResult = new ResponseResult(result);
    // presentation result

    res.status(result.httpMethodCode).send(responseResult);
}

async function deleteGuideById(req, res) {
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
        result = await GuideManager.deleteGuideById(value);
    }

    const responseResult = new ResponseResult(result);
    // presentation result

    res.status(result.httpMethodCode).send(responseResult);
}

module.exports = {
    addGuide,
    getGuides,
    findGuideById,
    updateGuideById,
    deleteGuideById
};
