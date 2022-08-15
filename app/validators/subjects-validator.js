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

module.exports = {
    idValidator,
    getSubjectsValidator
};
