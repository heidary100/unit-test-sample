'use strict';
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    roleId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Role'
    }
});

const UserRole = mongoose.model('UserRole', schema);

module.exports = {
    UserRole
};
