'use strict';
const mongoose = require('mongoose');
const {subjectPlugin} = require('../../providers/elasticsearchMongoosePlugin');

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true,
        maxlength: 250
    },
    priorityOrder: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    isEnabled: {
        required: true,
        default: true,
        type: Boolean
    }
});

// Applying plugin for elasticsearch
subjectPlugin(schema);

const Subject = mongoose.model('Subject', schema);

module.exports = {
    Subject
};
