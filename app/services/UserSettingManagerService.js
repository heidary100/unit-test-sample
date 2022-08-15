const speakeasy = require('speakeasy');

const ServiceResult = require('../api-models/ServiceResult');
const ResponseMessage = require('../api-models/ResponseMessage');
const ResponseMessageType = require('../api-models/ResponseMessageType');

/**
 * Creates a new Subject.
 * @class SubjectManager
 */
class UserSettingManager {
    constructor(User, logger) {
        this.User = User;
        this.logger = logger;
    }

    async updateTwoStepLoginTypeByUserId(model) {
        switch (model.twoStepLoginType) {
            case 'authenticator':
                try {
                    let user = await this.User.findById(model.id);
                    if (!user) {
                        return new ServiceResult({
                            success: false,
                            httpMethodCode: 404,
                            messages: [
                                new ResponseMessage({
                                    type: ResponseMessageType.error,
                                    message: 'USER_NOT_FOUND'
                                })
                            ]
                        });
                    }
                    const secret = speakeasy.generateSecret({ length: 20 });

                    user.twoStepLoginType = 'authenticator';
                    user.isTwoStepAuthenticationEnabled = true;
                    user.authenticatorValue = secret.base32;
                    user = await user.save();

                    return new ServiceResult({
                        success: true,
                        httpMethodCode: 200,
                        messages: [
                            new ResponseMessage({
                                type: ResponseMessageType.info,
                                message: secret.otpauth_url
                            })
                        ]
                    });
                } catch (err) {
                    this.logger.error(
                        `Updating user two step login failed > ${err.stack}`
                    );
                    return new ServiceResult({
                        success: false,
                        httpMethodCode: 500,
                        messages: [
                            new ResponseMessage({
                                type: ResponseMessageType.error,
                                message: 'INTERNAL_ERROR'
                            })
                        ]
                    });
                }
                break;
            default:
                return new ServiceResult({
                    success: false,
                    httpMethodCode: 400,
                    messages: [
                        new ResponseMessage({
                            type: ResponseMessageType.error,
                            message: 'INVALID_TYPE'
                        })
                    ]
                });
        }
    }
}

module.exports = UserSettingManager;
