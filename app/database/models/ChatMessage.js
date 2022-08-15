'use strict';
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        index: true,
        maxlength: 400
    },
    sentDateTime: {
        type: Date,
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

const ChatMessage = mongoose.model('ChatMessage', schema);

module.exports = {
    ChatMessage
};
