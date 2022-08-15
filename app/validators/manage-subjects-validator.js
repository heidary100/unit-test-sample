const Joi = require('joi');

function idValidator(id) {
    const schema = Joi.string().regex(/^[a-fA-F0-9]{24}$/).required();
    return Joi.validate(id, schema);
}

function getSubjectsValidator(model) {
    const schema = Joi.object().keys({
        limit: Joi.number().allow(null),
        offset: Joi.number().allow(null),
        query: Joi.string()
    });

    return Joi.validate(model, schema, {
        abortEarly: false
    });
}

function addSubjectValidator(addSubjectApiModel) {
    const schema = Joi.object().keys({
        title: Joi.string().max(64).required(),
        priorityOrder: Joi.number().min(0).allow(null),
        isEnabled: Joi.bool().allow(null),
    });

    return Joi.validate(addSubjectApiModel, schema, {
        abortEarly: false
    });
}

function updateSubjectValidator(updateSubjectApiModel) {
    const schema = Joi.object().keys({
        id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
        title: Joi.string().max(64).required(),
        priorityOrder: Joi.number().min(0).allow(null),
        isEnabled: Joi.bool().allow(null),
    });

    return Joi.validate(updateSubjectApiModel, schema, {
        abortEarly: false
    });
}

module.exports = {
    idValidator,
    getSubjectsValidator,
    addSubjectValidator,
    updateSubjectValidator
};
