const Joi = require('joi');

function idValidator(id) {
    const schema = Joi.string().regex(/^[a-f\d]{24}$/i);
    return Joi.validate(id, schema);
}

function addUserValidator(model) {
    const schema = Joi.object().keys({
        firstName: Joi.string()
            .max(100)
            .required()
            .regex(/^[A-Za-z\s]+$/),
        lastName: Joi.string()
            .max(100)
            .required()
            .regex(/^[A-Za-z\s]+$/),
        username: Joi.string()
            .max(32)
            .required()
            .regex(/^[a-zA-Z0-9]*$/),
        password: Joi.string()
            .min(8)
            .required()
            .max(32),
        passwordConfirmed: Joi.string()
            .min(8)
            .required()
            .max(55),
        email: Joi.string()
            .max(100)
            .required()
            .regex(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            ),
        phoneNumber: Joi.string()
            .max(20)
            .required()
            .regex(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/),
        imageName: Joi.string().max(100),
        isEnabled: Joi.bool()
    });

    return Joi.validate(model, schema, {
        abortEarly: false
    });
}

function getUsersValidator(model) {
    const schema = Joi.object().keys({
        limit: Joi.number()
            .min(1)
            .max(200)
            .required(),
        offset: Joi.number()
            .min(0)
            .required(),
        query: Joi.string()
    });

    return Joi.validate(model, schema, {
        abortEarly: false
    });
}

function updateUserByIdValidator(model) {
    const schema = Joi.object()
        .keys({
            id: Joi.string()
                .regex(/^[a-f\d]{24}$/i)
                .required(),
            firstName: Joi.string()
                .max(100)
                .regex(/^[A-Za-z\s]+$/),
            lastName: Joi.string()
                .max(100)
                .regex(/^[A-Za-z\s]+$/),
            username: Joi.string()
                .max(32)
                .regex(/^[a-zA-Z0-9]*$/),
            email: Joi.string()
                .max(100)
                .regex(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                ),
            phoneNumber: Joi.string()
                .max(20)
                .regex(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/),
            imageName: Joi.string()
                .max(100)
                .allow(null),
            isEnabled: Joi.bool()
        })
        .min(2);

    return Joi.validate(model, schema, {
        abortEarly: false
    });
}

module.exports = {
    idValidator,
    addUserValidator,
    getUsersValidator,
    updateUserByIdValidator
};
