const Joi = require('joi');

function usernameAndPassword(model) {
    const schema = Joi.object().keys({
        username: Joi.string()
            .regex(/^[a-zA-Z0-9]*$/)
            .required(),
        password: Joi.string().required(),
        token: Joi.string().optional()
    });

    return Joi.validate(model, schema, { abortEarly: false });
}

module.exports = {
    usernameAndPassword
};
