'use strict';
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        match: /^[A-Za-z\s]+$/,
        maxlength: 100
    }
});

const Role = mongoose.model('Role', schema);

module.exports = {
    Role
};
