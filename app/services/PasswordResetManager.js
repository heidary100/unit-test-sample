const ServiceResult = require('../api-models/ServiceResult');
const ResponseMessage = require('../api-models/ResponseMessage');
const ResponseMessageType = require('../api-models/ResponseMessageType');


class PasswordResetManager {
    
    constructor({ User, nodemailer }, logger) {
        this.User = User;
        this.nodemailer = nodemailer;
        this.logger = logger;
        this.logger.info('PasswordReset service started ...');
    }

    async forgetPassword(forgetPasswordApiModel) {

        try {
            let user = await this.User.findOne({
                email: forgetPasswordApiModel.email
            });

            if(user) {
                if(user.resetPasswordExpires > Date.now())
                {
                    this.logger.info(
                        'Password reset already was sent to your email.'
                    );

                    return new ServiceResult({
                        success: false,
                        httpMethodCode: 405,
                        messages: [
                            new ResponseMessage({
                                eventId: 4,
                                messageId: 1,
                                type: ResponseMessageType.error,
                                message: 'PASSWORD_RESET_SENT_TO_YOUR_EMAIL'
                            })
                        ]
                    });
                } else {
                    let token = user.setResetPasswordToken();
                    user.setResetPasswordExpires();

                    user.save();

                    this.nodemailer(user.email, 'we-will-guide-you Password Reset', 'You are receiving this because you (or someone else)' +
                        'have requested the reset of the password for your account.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                        'http://' + 'localhost:3000/api/v1' + '/reset/' + token + '\n\n' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                    );

                    this.logger.info(`Forget Password proccess with ${user._id} id succefully`);
                    return new ServiceResult({
                        success: true,
                        httpMethodCode: 200,
                        messages: [
                            new ResponseMessage({
                                eventId: -1,
                                messageId: 18,
                                type: ResponseMessageType.info,
                                message: 'FORGET_PASSWORD_SUCCESSFULLY'
                            })
                        ]
                    });
                }
            } else {
                this.logger.info(
                    `This User not exists with ${
                        forgetPasswordApiModel.email
                    } email`
                );

                return new ServiceResult({
                    success: false,
                    httpMethodCode: 501,
                    messages: [
                        new ResponseMessage({
                            eventId: 4,
                            messageId: 1,
                            type: ResponseMessageType.error,
                            message: 'USER_NOT_FOUND'
                        })
                    ]
                });
            }
        } catch (err) {

            this.logger.error(`Forget password failed > ${err.stack}`);

            return new ServiceResult({
                success: false,
                httpMethodCode: 400,
                messages: [
                    new ResponseMessage({
                        eventId: 4,
                        messageId: 1,
                        type: ResponseMessageType.error,
                        message: 'BAD_REQUEST'
                    })
                ]
            });
        }

    }

    async resetPassword(resetPasswordApiModel) {

        try {
            let user = await this.User.findOne({
                resetPasswordToken: resetPasswordApiModel.token,
                resetPasswordExpires: { $gt: Date.now() }
            });

            if(user) {

                try {
                    user.setPassword(resetPasswordApiModel.password, resetPasswordApiModel.passwordConfirmed);
                } catch (err) {
                    switch (err.message) {
                        case 'NOT_IDENTICAL':
                            return new ServiceResult({
                                success: false,
                                httpMethodCode: 422,
                                messages: [
                                    new ResponseMessage({
                                        eventId: -1,
                                        messageId: -1,
                                        type: ResponseMessageType.error,
                                        message: 'NOT_IDENTICAL_PASSWORDS'
                                    })
                                ]
                            });
                    }
                }
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                user.save();

                this.nodemailer(user.email, 'Your password has been changed', 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
                );

                this.logger.info(`Forget Password proccess with ${user._id} id succefully`);
                return new ServiceResult({
                    success: true,
                    httpMethodCode: 200,
                    messages: [
                        new ResponseMessage({
                            eventId: -1,
                            messageId: 18,
                            type: ResponseMessageType.info,
                            message: 'RESET_PASSWORD_SUCCESSFULLY'
                        })
                    ]
                });
            } else {
                this.logger.info(
                    'Password reset token is invalid or has expired.'
                );

                return new ServiceResult({
                    success: false,
                    httpMethodCode: 501,
                    messages: [
                        new ResponseMessage({
                            eventId: 4,
                            messageId: 1,
                            type: ResponseMessageType.error,
                            message: 'TOEKN_IS_INVALID_OR_HAS_EXPIRED'
                        })
                    ]
                });
            }

        } catch (err) {
            this.logger.error(`Reset password failed > ${err}`);

            return new ServiceResult({
                success: false,
                httpMethodCode: 400,
                messages: [
                    new ResponseMessage({
                        eventId: 4,
                        messageId: 1,
                        type: ResponseMessageType.error,
                        message: 'BAD_REQUEST'
                    })
                ]
            });
        }
    }
}

module.exports = PasswordResetManager;
