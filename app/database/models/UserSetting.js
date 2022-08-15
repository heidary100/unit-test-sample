'use strict';
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    notificationLevel: {
        type: Number
    },
    twoStepLoginType: {
        type: String,
        enum: ['email', 'phoneNumber', 'authenticator']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

const UserSetting = mongoose.model('UserSetting', schema);

module.exports = {
    UserSetting
};
