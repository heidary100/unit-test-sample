'use strict';
const mongoose = require('mongoose');
const crypto = require('crypto');
const config = require('config');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        index: true,
        match: /^[A-Za-z\s]+$/,
        maxlength: 100
    },
    lastName: {
        type: String,
        required: true,
        index: true,
        match: /^[A-Za-z\s]+$/,
        maxlength: 100
    },
    username: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true,
        index: true,
        match: /^[a-zA-Z0-9]*$/,
        maxlength: 32
    },
    email: {
        type: String,
        unique: true,
        uniqueCaseInsensitive: true,
        required: true,
        index: true,
        match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
	resetPasswordToken: {
        type: String
	},
    resetPasswordExpires: {
        type: Date
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        index: true,
        match: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/
    },
    imageName: {
        type: String,
        maxlength: 100,
        index: {
            unique: true,
            partialFilterExpression: { imageName: { $type: 'string' } }
        }
    },
    passwordHash: {
        type: String,
        required: true
    },
    hashIterations: {
        type: Number,
        required: true,
        minlength: 8000,
        maxlength: 12000
    },
    salt: {
        type: String,
        required: true,
        maxlength: 32
    },
    notificationLevel: {
        type: Number
    },
    twoStepLoginType: {
        type: String,
        enum: ['email', 'phoneNumber', 'authenticator']
    },
    authenticatorValue: {
        type: String
    },
    creationDate: {
        default: Date.now,
        type: Date,
        required: true
    },
    loginAttempts: {
        default: 0,
        type: Number,
        required: true
    },
    loginHistory: {
        type: [Object]
    },
    securityStamp: {
        type: String
    },
    isEnabled: {
        default: true,
        required: true,
        type: Boolean
    },
    isTwoStepAuthenticationEnabled: {
        default: false,
        required: true,
        type: Boolean
    },
    isLockedOut: {
        default: false,
        required: true,
        type: Boolean
    },
    isEmailConfirmed: {
        default: false,
        required: true,
        type: Boolean
    },
    isPhoneNumberConfirmed: {
        default: false,
        required: true,
        type: Boolean
    },
    lockedOutEndDateTimeUTC: {
        type: Date
    }
});

UserSchema.methods.setPassword = function(password, passwordConfirmed) {
    if (password !== passwordConfirmed) {
        throw new Error('NOT_IDENTICAL');
    }
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hashIterations = Math.floor(Math.random() * 4000 + 8000);
    this.passwordHash = crypto
        .pbkdf2Sync(password, this.salt, this.hashIterations, 512, 'sha512')
        .toString('hex');
};

UserSchema.methods.validatePassword = function(password) {
    const passwordHash = crypto
        .pbkdf2Sync(password, this.salt, this.hashIterations, 512, 'sha512')
        .toString('hex');
    return this.passwordHash === passwordHash;
};

UserSchema.methods.setResetPasswordToken = function() {
    return this.resetPasswordToken =  crypto.randomBytes(20).toString('hex');
};

UserSchema.methods.setResetPasswordExpires = function() {
    this.resetPasswordExpires = Date.now() + 3600000; // 1 hour
};

UserSchema.methods.generateAuthToken = async function() {
    // const { Role } = require('./Role'); // TODO
    const { UserRole } = require('./UserRole');

    const userRoles = await UserRole.find({ userId: this._id }).populate(
        'roleId'
    );

    const roles = [];
    userRoles.forEach(userRole => {
        roles.push(userRole.roleId.title);
    });

    return jwt.sign({ id: this._id, roles }, config.get('jwt.privateKey'));
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
