const QueryApiModel = require('../api-models/QueryApiModel');
const validators = require('../validators/subjects-validator');
const ResponseResult = require('../api-models/ResponseResult');
const ResponseMessage = require('../api-models/ResponseMessage');
const ResponseMessageType = require('../api-models/ResponseMessageType');
const SubjectManager = require('../services/SubjectManagerService');
const { Subject } = require('../database/models/Subject');
const logger = require('../providers/logger-factory')('Service - SubjectManager');

const subjectManager = new SubjectManager(Subject, logger);

async function findSubjectById(req, res) {
    
    const { id } = req.params;
    const { error, value } = validators.idValidator(id);

    let serviceResult;
    let httpMethodCode;
    
    if(error) {
        const errors = [];

        error.details.forEach(err => {
            errors.push(new ResponseMessage({
                eventId: -305,
                type: ResponseMessageType.error,
                message: err.message
            }));
        });
        
        serviceResult = new ResponseResult({
            success: false,
            messages: [errors]
        });
        httpMethodCode = 400;
    } else {
        // Send data to service
        const response = await subjectManager.findSubjectById(value);

        // Presentation result
        serviceResult = new ResponseResult(response);
        httpMethodCode = response.httpMethodCode;
    }

    res.status(httpMethodCode).send(serviceResult);
}

async function getSubjects(req, res) {

    const model = new QueryApiModel(req.query);
    const { error, value } = validators.getSubjectsValidator(model);
    // handle validation for getSubjects

    let response;
    let httpMethodCode;

    if(error) {
        const errors = [];

        error.details.forEach(err => {
            errors.push(new ResponseMessage({
                eventId: -306,
                type: ResponseMessageType.error,
                message: err.message
            }));
        });

        response = new ResponseResult({
            success: false,
            messages: [errors]
        });
        httpMethodCode = 400;
    } else {
        // Send data to service
        const { limit, offset } = value;
        const serviceResult = await subjectManager.getSubjects(limit, offset);

        // presentation result
        response = new ResponseResult(serviceResult);
        httpMethodCode = response.httpMethodCode;
    }

    res.status(httpMethodCode).send(response);
}

module.exports = {
    findSubjectById,
    getSubjects
};

