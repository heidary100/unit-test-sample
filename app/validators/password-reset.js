const Joi = require('joi');

function forgetPasswordValidators(model) {
    const schema = Joi.object().keys({
        email: Joi.string()
            .max(100)
            .required()
            .regex(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    });

    return Joi.validate(model, schema, {
        abortEarly: false
    });
}

function resetPasswordValidators(model) {
    const schema = Joi.object().keys({
        token: Joi.string().regex(/^[a-fA-F0-9]{40}$/).required(),
        password: Joi.string()
            .min(8)
            .required()
            .max(32),
        passwordConfirmed: Joi.string()
            .min(8)
            .required()
            .max(32),
    });

    return Joi.validate(model, schema, {
        abortEarly: false
    });
}

module.exports = {
    forgetPasswordValidators,
    resetPasswordValidators
};
