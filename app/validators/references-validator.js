const Joi = require('joi');

function optionalIdValidator(id) {
    const schema = Joi.string().regex(/^[a-fA-F0-9]{24}$/).optional();
    return Joi.validate(id, schema);
}

function idValidator(id) {
    const schema = Joi.string().regex(/^[a-fA-F0-9]{24}$/).required();
    return Joi.validate(id, schema);
}

module.exports = {
    optionalIdValidator,
    idValidator
};