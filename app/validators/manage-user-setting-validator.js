const Joi = require('joi');

function idValidator(id) {
    const schema = Joi.string().regex(/^[a-fA-F0-9]{24}$/).required();
    return Joi.validate(id, schema);
}

function updateNotificationLevelValidator(number) {
    const schema = Joi.number().allow(null);
    return Joi.validate(number, schema);
}

function updateTwoStepLoginTypeValidator(model) {
    const schema = Joi.object({
        id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
        twoStepLoginType: Joi.string().valid(['email', 'authenticator', 'phoneNumber']).required()
    });
    return Joi.validate(model, schema, { abortEarly: false });
}

module.exports = {
    idValidator,
    updateNotificationLevelValidator,
    updateTwoStepLoginTypeValidator
};
