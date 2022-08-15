jest.mock('../../../app/database/models/User');

const logger = require('../../logger-factory')(
    'Service - User Setting Manager'
);
const UserSettingManagerService = require('../../../app/services/UserSettingManagerService');
const User = require('../../../app/database/models/User');

describe('User setting manager service', () => {
    let user;
    describe('Update Two Step Login Type By User Id', () => {
        beforeEach(() => {
            jest.resetAllMocks();
            user = {
                id: '1',
                save: jest.fn().mockReturnValue(Promise.resolve(user))
            };
        });

        it('should return "USER_NOT_FOUND" for invalid user id.', async () => {
            const model = {
                id: '12334',
                twoStepLoginType: 'authenticator'
            };

            User.findById.mockReturnValueOnce(Promise.resolve(undefined));
            const service = new UserSettingManagerService(User, logger);
            
            const result = await service.updateTwoStepLoginTypeByUserId(model);

            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(404);
            expect(result.messages[0].message).toBe('USER_NOT_FOUND');
        });

        it('should return "INVALID_TYPE" for types other than authenticator.', async () => {
            const model = {
                id: '1',
                twoStepLoginType: 'email'
            };

            User.findById.mockReturnValueOnce(Promise.resolve(user));
            const service = new UserSettingManagerService(User, logger);
            
            const result = await service.updateTwoStepLoginTypeByUserId(model);

            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(400);
            expect(result.messages[0].message).toBe('INVALID_TYPE');
        });

        it('should return otpauth url for authenticator option.', async () => {
            const model = {
                id: '1',
                twoStepLoginType: 'authenticator'
            };

            User.findById.mockReturnValueOnce(Promise.resolve(user));
            const service = new UserSettingManagerService(User, logger);
            const result = await service.updateTwoStepLoginTypeByUserId(model);

            expect(result.success).toBeTruthy();
            expect(result.httpMethodCode).toBe(200);
            expect(result.messages[0].message).toBe(`otpauth://totp/SecretKey?secret=${user.authenticatorValue}`);
        });

        it('should return "INTERNAL_ERROR" url for authenticator option.', async () => {
            const model = {
                id: '1',
                twoStepLoginType: 'authenticator'
            };

            User.findById.mockReturnValueOnce(Promise.reject(new Error()));
            const service = new UserSettingManagerService(User, logger);
            const result = await service.updateTwoStepLoginTypeByUserId(model);

            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(500);
            expect(result.messages[0].message).toBe('INTERNAL_ERROR');
        });
    });
});
