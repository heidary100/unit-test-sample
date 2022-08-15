const Joi = require('joi');

function idValidator(id) {
    const schema = Joi.string().regex(/^[a-fA-F0-9]{24}$/).required();
    return Joi.validate(id, schema);
}

function getReferencesValidator(model) {
    const schema = Joi.object().keys({
        parentId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).default(undefined)
    });

    return Joi.validate(model, schema, {
        abortEarly: false
    });
}

function addReferenceValidator(model) {
    const schema = Joi.object().keys({
        title: Joi.string().max(64).required(),
        text: Joi.string().required(),
        priorityOrder: Joi.number().min(0).required(),
        isEnabled: Joi.bool().required(),
        parentId: Joi.string().allow('').regex(/^[a-fA-F0-9]{24}$/).default(null),
    });

    return Joi.validate(model, schema, {
        abortEarly: false
    });
}

function updateReferenceByIdValidator(model) {
    const schema = Joi.object().keys({
        id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
        title: Joi.string().max(64).optional(),
        text: Joi.string().optional(),
        priorityOrder: Joi.number().min(0).optional(),
        isEnabled: Joi.bool().optional(),
        parentId: Joi.string().allow('').regex(/^[a-fA-F0-9]{24}$/).optional(),
    });

    return Joi.validate(model, schema, {
        abortEarly: false
    });
}

module.exports = {
    idValidator,
    getReferencesValidator,
    addReferenceValidator,
    updateReferenceByIdValidator
};