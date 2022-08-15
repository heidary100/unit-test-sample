const Joi = require('joi');

function idValidator(id) {
    const schema = Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required();
    return Joi.validate(id, schema);
}

function addGuideValidator(model) {
    const schema = Joi.object().keys({
        title: Joi.string()
            .min(1)
            .max(250)
            .required(),
        text: Joi.string().required(),
        priorityOrder: Joi.number(),
        isEnabled: Joi.boolean(),
        tags: Joi.array().items(Joi.string()),
        authorUserId: Joi.string()
            .required()
            .regex(/^[a-fA-F0-9]{24}$/),
        subjectId: Joi.string()
            .required()
            .regex(/^[a-fA-F0-9]{24}$/)
    });

    return Joi.validate(model, schema, {
        abortEarly: false
    });
}

function getGuidesValidator(model) {
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

function updateGuideByIdValidator(model) {
    const schema = Joi.object()
        .keys({
            id: Joi.string()
                .regex(/^[a-f\d]{24}$/i)
                .required(),
            title: Joi.string()
                .min(1)
                .max(250),
            text: Joi.string(),
            priorityOrder: Joi.number(),
            isEnabled: Joi.boolean(),
            tags: Joi.array().items(Joi.string()),
            subjectId: Joi.string().regex(/^[a-fA-F0-9]{24}$/)
        })
        .min(2);

    return Joi.validate(model, schema, {
        abortEarly: false
    });
}

module.exports = {
    idValidator,
    getGuidesValidator,
    addGuideValidator,
    updateGuideByIdValidator
};
