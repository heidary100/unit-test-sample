const AddSubjectApiModel = require('../api-models/subjects/AddSubjectApiModel');
const UpdateSubjectApiModel = require('../api-models/subjects/UpdateSubjectApiModel');
const QueryApiModel = require('../api-models/QueryApiModel');
const validators = require('../validators/manage-subjects-validator');
const ResponseResult = require('../api-models/ResponseResult');
const ResponseMessage = require('../api-models/ResponseMessage');
const ResponseMessageType = require('../api-models/ResponseMessageType');
const ServiceResult = require('../api-models/ServiceResult');
const SubjectManager = require('../services/SubjectManagerService');
const { Subject } = require('../database/models/Subject');
const logger = require('../providers/logger-factory')('Service - SubjectManager');

const subjectManager = new SubjectManager(Subject, logger);

async function addSubject(req, res) {
    // map body to model
    let addSubjectApiModel = new AddSubjectApiModel(req.body);
    // handle validation for AddUserApiModel
    const { error, value } = validators.addSubjectValidator(addSubjectApiModel);

    let serviceResult;

    if (error) {
        const errors = [];

        error.details.forEach(err => {
            errors.push(new ResponseMessage({
                eventId: -300,
                type: ResponseMessageType.error,
                message: err.message
            }));
        });

        serviceResult =  new ServiceResult( {
            success: false,
            httpMethodCode: 400,
            messages: [errors]
        });
    } else {
        // Send Data to Service
        serviceResult = await subjectManager.addSubject(value);
    }

    // presentation result
    let responseResult = new ResponseResult(serviceResult);

    res.status(serviceResult.httpMethodCode).send(responseResult);
}

async function findSubjectById(req, res) {
    
    const { id } = req.params;
    const { error, value } = validators.idValidator(id);

    let serviceResult;
    
    if(error) {
        const errors = [];

        error.details.forEach(err => {
            errors.push(new ResponseMessage({
                eventId: -301,
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
        serviceResult = await subjectManager.findSubjectById(value);
    }

    // Presentation result
    let responseResult = new ResponseResult(serviceResult);

    res.status(serviceResult.httpMethodCode).send(responseResult);
}

async function updateSubjectById(req, res) {
    
    const { id } = req.params;
    // handle validation

    // map body to model
    let updateSubjectApiModel = new UpdateSubjectApiModel(req.body);

    updateSubjectApiModel['id'] = id;

    // handle validation for AddUserApiModel
    const { error, value } = validators.updateSubjectValidator(updateSubjectApiModel);

    let serviceResult;


    if (error) {
        const errors = [];

        error.details.forEach(err => {
            errors.push(new ResponseMessage({
                eventId: -302,
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
        serviceResult = await subjectManager.updateSubjectById(value);
    }

    // presentation result
    let responseResult = new ResponseResult(serviceResult);

    res.status(serviceResult.httpMethodCode).send(responseResult);
}

async function deleteSubjectById(req, res) {
     
    const { id } = req.params;
    const { error, value } = validators.idValidator(id);
    // handle validation for id

    let serviceResult;

    if(error) {
        const errors = [];

        error.details.forEach(err => {
            errors.push(new ResponseMessage({
                eventId: -303,
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
        serviceResult = await subjectManager.deleteSubjectById(value);
    }

    // Presentation result
    let responseResult = new ResponseResult(serviceResult);

    // Sending the result
    res.status(serviceResult.httpMethodCode).send(responseResult);
}

async function getSubjects(req, res) {

    const model = new QueryApiModel(req.query);
    const { error, value } = validators.getSubjectsValidator(model);
    // handle validation for getSubjects

    let serviceResult;

    if(error) {
        const errors = [];

        error.details.forEach(err => {
            errors.push(new ResponseMessage({
                eventId: -304,
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
        const { limit, offset } = value;
        serviceResult = await subjectManager.getSubjects(limit, offset);
    }

    // presentation result
    let responseResult = new ResponseResult(serviceResult);

    res.status(serviceResult.httpMethodCode).send(responseResult);
}

module.exports = {
    addSubject,
    findSubjectById,
    updateSubjectById,
    deleteSubjectById,
    getSubjects
};

