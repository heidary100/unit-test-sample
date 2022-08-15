const manageReferencesValidator = require('../validators/manage-references-validator');
const ResponseMessage = require('../api-models/ResponseMessage');
const ResponseMessageType = require('../api-models/ResponseMessageType');
const ResponseResult = require('../api-models/ResponseResult');
const service = require('../services/ReferenceManagerService');
const AddReferenceAdminApiModel = require('../api-models/reference/AddReferenceAdminApiModel');
const UpdateReferenceAdminApiModel = require('../api-models/reference/UpdateReferenceAdminApiModel');

/**
 * Use this controller for getting reference list with parent id. Note that you must first authenticate the user.
 * @param {HttpRequest} req Request parameter from express
 * @param {HttpResponse} res Response parameter from express
 */
async function getReferences(req, res) {
    let response;
    let httpMethodCode;

    // Validate request params
    const { error, value } = manageReferencesValidator.getReferencesValidator(
        req.query
    );

    if (error) {
        const errors = [];

        error.details.forEach(err => {
            errors.push(
                new ResponseMessage({
                    eventId: -420,
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
        const result = await service.getReferencesAdmin(value.parentId);

        // Presentation result
        response = new ResponseResult(result);
        httpMethodCode = result.httpMethodCode;
    }

    // Sending the result
    res.status(httpMethodCode).send(response);
}

/**
 * Use this controller for adding new reference to the collection. Note that you must first authenticate the user.
 * @param {HttpRequest} req Request parameter from express
 * @param {HttpResponse} res Response parameter from express
 */
async function addReference(req, res) {
    // Map and validate request body
    const { error, value } = manageReferencesValidator.addReferenceValidator(
        req.body
    );

    let response;
    let httpMethodCode;

    if (error) {
        const errors = [];

        error.details.forEach(err => {
            errors.push(
                new ResponseMessage({
                    eventId: -421,
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
        const model = new AddReferenceAdminApiModel({
            ...value,
            lastModifierUserId: req.user.id
        });

        // Send data to service
        const result = await service.addReferenceAdmin(model);

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
    let response;
    let httpMethodCode;

    // Validate request params
    const { id } = req.params;
    const { error, value } = manageReferencesValidator.idValidator(id);

    if (error) {
        const errors = [];

        error.details.forEach(err => {
            errors.push(
                new ResponseMessage({
                    eventId: -422,
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
        const result = await service.findReferenceByIdAdmin(value);

        // Presentation result
        response = new ResponseResult(result);
        httpMethodCode = result.httpMethodCode;
    }

    // Sending the result
    res.status(httpMethodCode).send(response);
}

/**
 * Use this controller for updating a reference by id. Note that you must first authenticate the user.
 * @param {HttpRequest} req Request parameter from express
 * @param {HttpResponse} res Response parameter from express
 */
async function updateReferenceById(req, res) {
    let response;
    let httpMethodCode;

    // Validate request params and body
    const { id } = req.params;
    const {
        error,
        value
    } = manageReferencesValidator.updateReferenceByIdValidator({
        ...req.body,
        id
    });

    if (error) {
        const errors = [];

        error.details.forEach(err => {
            errors.push(
                new ResponseMessage({
                    eventId: -423,
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
        const model = new UpdateReferenceAdminApiModel({
            ...value,
            lastModifierUserId: req.user.id
        });
        // Send data to service
        const result = await service.updateReferenceByIdAdmin(model);

        // Presentation result
        response = new ResponseResult(result);
        httpMethodCode = result.httpMethodCode;
    }

    // Sending the result
    res.status(httpMethodCode).send(response);
}

/**
 * Use this controller for deleting a reference by id. Note that you must first authenticate the user.
 * @param {HttpRequest} req Request parameter from express
 * @param {HttpResponse} res Response parameter from express
 */
async function deleteReferenceById(req, res) {
    let response;
    let httpMethodCode;

    // Validate request params
    const { id } = req.params;
    const { error, value } = manageReferencesValidator.idValidator(id);

    if (error) {
        const errors = [];

        error.details.forEach(err => {
            errors.push(
                new ResponseMessage({
                    eventId: -424,
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
        const result = await service.deleteReferenceByIdAdmin(value);

        // Presentation result
        response = new ResponseResult(result);
        httpMethodCode = result.httpMethodCode;
    }

    // Sending the result
    res.status(httpMethodCode).send(response);
}

module.exports = {
    getReferences,
    addReference,
    findReferenceById,
    updateReferenceById,
    deleteReferenceById
};
