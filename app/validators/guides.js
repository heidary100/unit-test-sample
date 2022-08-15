const Joi = require('joi');

function idValidator(id) {
    const schema = Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required();
    return Joi.validate(id, schema);
}

module.exports = {
    idValidator
};
