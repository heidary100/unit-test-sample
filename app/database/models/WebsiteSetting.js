'use strict';
const mongoose = require('mongoose');

const websiteSettingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 250
    },
    contactUsText: {
        type: String,
        required: true
    },
    aboutUsText: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 400
    },
    keywords: {
        type: [String]
    }
});

const WebsiteSetting = mongoose.model('WebsiteSetting', websiteSettingSchema);

module.exports = WebsiteSetting;