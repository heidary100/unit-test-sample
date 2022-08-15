'use strict';
const mongoose = require('mongoose');
// const {referencePlugin} = require('../../providers/elasticsearchMongoosePlugin');

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
    priorityOrder: {
        type: Number,
        required: true,
        min: 0
    },
    isEnabled: {
        required: true,
        type: Boolean
    },
    lastModifiedDateTime: {
        type: Date,
        required: true
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Reference'
    },
    lastModifierUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

// Applying plugin for elasticsearch
// referencePlugin(schema);

const Reference = mongoose.model('Reference', schema);

module.exports = {
    Reference
};
