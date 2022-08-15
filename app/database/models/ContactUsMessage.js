'use strict';
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true,
        maxlength: 250
    },
    text: {
        type: String,
        required: true,
        index: true,
        maxlength: 1200
    },
    email: {
        type: String,
        unique: true,
        required: true,
        index: true,
        match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    isSeen: {
        required: true,
        type: Boolean
    },
    sentDate: {
        type: Date,
        required: true
    }
});

const ContactUsMessage = mongoose.model('ContactUsMessage', schema);

module.exports = {
    ContactUsMessage
};
