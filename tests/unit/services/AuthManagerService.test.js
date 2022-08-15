jest.mock('../../../app/database/models/User');
const User = require('../../../app/database/models/User');

const service = require('../../../app/services/AuthManagerService');

jest.mock('speakeasy');
const speakeasy = require('speakeasy');

describe('Auth manager service.', () => {
    const users = [
        {
            id: '1',
            username: 'username1',
            password: 'pass1',
            loginHistory: [],
            loginAttempts: 0,
            authenticatorValue: null,
            isTwoStepAuthenticationEnabled: false,
            isEnabled: true,
            isLockedOut: false,
            lockedOutEndDateTimeUTC: null
        },
        {
            id: '2',
            username: 'username2',
            password: 'pass2',
            loginHistory: [],
            loginAttempts: 0,
            authenticatorValue: null,
            isTwoStepAuthenticationEnabled: false,
            isEnabled: false,
            isLockedOut: false,
            lockedOutEndDateTimeUTC: null
        },
        {
            id: '3',
            username: 'username3',
            password: 'pass3',
            loginHistory: [],
            loginAttempts: 0,
            authenticatorValue: null,
            isTwoStepAuthenticationEnabled: true,
            isEnabled: true,
            isLockedOut: false,
            lockedOutEndDateTimeUTC: null
        }
    ];
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('Login with username and password.', () => {
        it('should login and return token (200) with valid username and password and disabled 2FA.', async () => {
            User.findOne = jest.fn().mockReturnValueOnce(users[0]);
            users[0].validatePassword = jest.fn().mockReturnValueOnce(true);
            users[0].generateAuthToken = jest.fn().mockReturnValueOnce('token');
            users[0].save = jest.fn().mockReturnValueOnce({});
            const result = await service.loginWithUsername({
                username: 'username1',
                password: 'pass1',
                ip: '::1'
            });

            expect(result.success).toBeTruthy();
            expect(result.httpMethodCode).toBe(200);
            expect(result.messages[0].message).toBe('LOGGED_IN');
            expect(result.result).toHaveProperty('token', 'token');
        });

        it('should return "BAD_USERNAME_OR_PASSWORD" for wrong username or password.', async () => {
            User.findOne = jest.fn().mockReturnValueOnce(users[0]);
            users[0].validatePassword = jest.fn().mockReturnValueOnce(false);

            // Wrong password
            const result = await service.loginWithUsername({
                username: 'username1',
                password: 'passss1',
                ip: '::1'
            });

            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(401);
            expect(result.messages[0].message).toBe('BAD_USERNAME_OR_PASSWORD');

            User.findOne = jest.fn().mockReturnValueOnce(null);

            // Wrong username
            const result2 = await service.loginWithUsername({
                username: 'username4',
                password: 'passss1',
                ip: '::1'
            });

            expect(result2.success).toBeFalsy();
            expect(result2.httpMethodCode).toBe(401);
            expect(result.messages[0].message).toBe('BAD_USERNAME_OR_PASSWORD');
        });

        it('should return "ACCESS_DENIED" for disabled account.', async () => {
            User.findOne = jest.fn().mockReturnValueOnce(users[1]);
            users[1].validatePassword = jest.fn().mockReturnValueOnce(true);

            const result = await service.loginWithUsername({
                username: 'username2',
                password: 'pass2',
                ip: '::1'
            });

            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(401);
            expect(result.messages[0].message).toBe('ACCESS_DENIED');
        });

        it('should lock account and return 401 after 5 login attempts with wrong credentials.', async () => {
            User.findOne = jest.fn().mockReturnValue(users[0]);
            users[0].validatePassword = jest.fn().mockReturnValue(false);

            for (let i = 0; i < 5; i++) {
                const result = await service.loginWithUsername({
                    username: 'username1',
                    password: 'passss1',
                    ip: '::1'
                });
                expect(result.success).toBeFalsy();
                expect(result.httpMethodCode).toBe(401);
            }

            const result = await service.loginWithUsername({
                username: 'username1',
                password: 'passss1',
                ip: '::1'
            });
            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(401);
            expect(result.messages[0].message).toBe('LOCKED_OUT');
        });

        it('should return "2FA_TOKEN_NOT_FOUND" for not providing token for user with enabled 2FA.', async () => {
            User.findOne = jest.fn().mockReturnValueOnce(users[2]);
            users[2].validatePassword = jest.fn().mockReturnValueOnce(true);

            const result = await service.loginWithUsername({
                username: 'username3',
                password: 'pass3'
            });

            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(400);
            expect(result.messages[0].message).toBe('2FA_TOKEN_NOT_FOUND');
        });

        it('should return "WRONG_2FA_TOKEN" for not providing valid token for user with enabled 2FA.', async () => {
            User.findOne = jest.fn().mockReturnValueOnce(users[2]);
            users[2].validatePassword = jest.fn().mockReturnValueOnce(true);
            speakeasy.totp.verify = jest.fn().mockReturnValueOnce({
                valueOf: jest.fn().mockReturnValueOnce(false)
            });

            const result = await service.loginWithUsername({
                username: 'username3',
                password: 'pass3',
                token: 'token'
            });

            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(401);
            expect(result.messages[0].message).toBe('WRONG_2FA_TOKEN');
        });

        it('should login and return token (200) with valid username and password and 2FA token.', async () => {
            User.findOne = jest.fn().mockReturnValueOnce(users[2]);
            users[2].validatePassword = jest.fn().mockReturnValueOnce(true);
            users[2].generateAuthToken = jest.fn().mockReturnValueOnce('token');
            users[2].save = jest.fn().mockReturnValueOnce({});
            speakeasy.totp.verify = jest.fn().mockReturnValueOnce({
                valueOf: jest.fn().mockReturnValueOnce(true)
            });

            const result = await service.loginWithUsername({
                username: 'username3',
                password: 'pass3',
                token: 'token'
            });

            expect(result.success).toBeTruthy();
            expect(result.httpMethodCode).toBe(200);
            expect(result.messages[0].message).toBe('LOGGED_IN');
            expect(result.result).toHaveProperty('token', 'token');
        });

        it('should return "BAD_REQUEST" when error occures.', async () => {
            User.findOne = jest.fn().mockImplementationOnce(() => {
                throw new Error();
            });
            const result = await service.loginWithUsername({});

            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(500);
            expect(result.messages[0].message).toBe('INTERNAL_ERROR');
        });
    });
});
