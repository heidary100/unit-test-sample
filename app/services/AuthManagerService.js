const speakeasy = require('speakeasy');

const ServiceResult = require('../api-models/ServiceResult');
const ResponseMessage = require('../api-models/ResponseMessage');
const ResponseMessageType = require('../api-models/ResponseMessageType');
const LoginResponseGuestApiModel = require('../api-models/auth/LoginResponseGuestApiModel');
const User = require('../database/models/User');
const logger = require('../providers/logger-factory')('Service - AuthManager');

/**
 * Use this mthod for loging in with username and password
 * @param {model} param username, password and ip model
 */
async function loginWithUsername({ username, password, ip, token }) {
    try {
        let timeUtc = new Date();
        timeUtc = new Date(timeUtc.toUTCString());

        const user = await User.findOne({ username });
        if (user) {
            if (!user.isEnabled) {
                logger.warn(`User ${user.username} is disabled.`);

                return new ServiceResult({
                    success: false,
                    httpMethodCode: 401,
                    messages: [
                        new ResponseMessage({
                            eventId: -401,
                            type: ResponseMessageType.error,
                            message: 'ACCESS_DENIED'
                        })
                    ]
                });
            } else if (
                user.isLockedOut &&
                user.lockedOutEndDateTimeUTC > timeUtc
            ) {
                logger.warn(
                    `User ${user.username} is locked out until ${
                        user.lockedOutEndDateTimeUTC
                    }`
                );

                return new ServiceResult({
                    success: false,
                    httpMethodCode: 401,
                    messages: [
                        new ResponseMessage({
                            eventId: -402,
                            type: ResponseMessageType.error,
                            message: 'LOCKED_OUT'
                        })
                    ]
                });
            } else if (user.validatePassword(password)) {
                if (user.isTwoStepAuthenticationEnabled) {
                    if (!token) {
                        logger.info(
                            `User ${username} has enabled 2FA but didn't provide any token.`
                        );

                        return new ServiceResult({
                            success: false,
                            httpMethodCode: 400,
                            messages: [
                                new ResponseMessage({
                                    eventId: -403,
                                    type: ResponseMessageType.error,
                                    message: '2FA_TOKEN_NOT_FOUND'
                                })
                            ]
                        });
                    }

                    const verified = speakeasy.totp.verify({
                        secret: user.authenticatorValue,
                        encoding: 'base32',
                        token: token
                    });

                    if (!verified.valueOf()) {
                        logger.info(
                            `User ${username} has entered wrong token for 2FA.`
                        );

                        return new ServiceResult({
                            success: false,
                            httpMethodCode: 401,
                            messages: [
                                new ResponseMessage({
                                    eventId: -404,
                                    type: ResponseMessageType.error,
                                    message: 'WRONG_2FA_TOKEN'
                                })
                            ]
                        });
                    }
                    logger.info(`User ${username} logged in with 2FA.`);
                }
                const jwtToken = await user.generateAuthToken();
                user.loginHistory.push({ time: timeUtc, ip });
                user.loginAttempts = 0;
                user.save();

                logger.info(
                    `User ${username} logged in succesfully. ProvidedToken: ${jwtToken} .`
                );

                return new ServiceResult({
                    result: new LoginResponseGuestApiModel(jwtToken),
                    success: true,
                    httpMethodCode: 200,
                    messages: [
                        new ResponseMessage({
                            eventId: 400,
                            type: ResponseMessageType.info,
                            message: 'LOGGED_IN'
                        })
                    ]
                });
            } else {
                logger.error(`wrong password for user ${user.username} .`);

                user.loginAttempts++;
                let lockOut = false;
                let time;

                switch (user.loginAttempts) {
                    case 5:
                        lockOut = true;
                        time = 5;
                        break;
                    case 10:
                        lockOut = true;
                        time = 10;
                        break;
                    case 15:
                        lockOut = true;
                        time = 15;
                        break;
                    case 20:
                        lockOut = true;
                        time = 20;
                        break;
                }

                if (lockOut) {
                    timeUtc.setMinutes(timeUtc.getMinutes() + time);
                    user.isLockedOut = true;
                    user.lockedOutEndDateTimeUTC = timeUtc;
                    await user.save();

                    logger.warn(
                        `User ${user.username} disabled until ${
                            user.lockedOutEndDateTimeUTC
                        }`
                    );

                    return new ServiceResult({
                        success: false,
                        httpMethodCode: 401,
                        messages: [
                            new ResponseMessage({
                                eventId: -405,
                                type: ResponseMessageType.error,
                                message: 'LOCKED_OUT_DISABLED_FOR_'
                            })
                        ]
                    });
                }

                if (user.loginAttempts > 20) {
                    user.isEnabled = false;
                    await user.save();

                    logger.warn(`User ${user.username} disabled permenatly.`);

                    return new ServiceResult({
                        success: false,
                        httpMethodCode: 401,
                        messages: [
                            new ResponseMessage({
                                eventId: -406,
                                type: ResponseMessageType.error,
                                message: 'DISABLED'
                            })
                        ]
                    });
                }

                await user.save();
            }
        } else {
            logger.error('wrong username.');
        }

        return new ServiceResult({
            success: false,
            httpMethodCode: 401,
            messages: [
                new ResponseMessage({
                    eventId: -407,
                    type: ResponseMessageType.error,
                    message: 'BAD_USERNAME_OR_PASSWORD'
                })
            ]
        });
    } catch (err) {
        logger.error(`error in login attemption > ${err.stack}`);
        return new ServiceResult({
            success: false,
            httpMethodCode: 500,
            messages: [
                new ResponseMessage({
                    eventId: -408,
                    type: ResponseMessageType.error,
                    message: 'INTERNAL_ERROR'
                })
            ]
        });
    }
}

module.exports = {
    loginWithUsername
};
