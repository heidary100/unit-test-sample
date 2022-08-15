'use strict';
const mongoose = require('mongoose');
const { guidePlugin } = require('../../providers/elasticsearchMongoosePlugin');

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true,
        maxlength: 250
    },
    text: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        index: true
    },
    priorityOrder: {
        type: Number,
        required: true,
        default: 0
    },
    isEnabled: {
        required: true,
        type: Boolean,
        default: true
    },
    lastModifiedDateTime: {
        type: Date,
        required: true,
        default: Date.now
    },
    authorUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        exists: true
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Subject',
        exists: true
    }
});

// Applying plugin for elasticsearch
guidePlugin(schema);

const Guide = mongoose.model('Guide', schema);

module.exports = {
    Guide
};
