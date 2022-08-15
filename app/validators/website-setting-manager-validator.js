const Joi = require('joi');

function updateWebsiteSettingValidator(model) {
    const schema = Joi.object().keys({
        title: Joi.string()
            .max(250),
        contactUsText: Joi.string(),
        aboutUsText: Joi.string(),
        keywords: Joi.array(),
        description: Joi.string()
            .max(400)
    });

    return Joi.validate(model, schema, {
        abortEarly: false
    });
}

module.exports = {
    updateWebsiteSettingValidator
};
