const ServiceResult = require('../../../app/api-models/ServiceResult');

jest.mock('../../../app/services/PasswordResetManager.js');
const PasswordResetManagerService = require('../../../app/services/PasswordResetManager');

const httpMocks = require('node-mocks-http');

describe('Controller route /manage/password-reset', () => {
    let serviceResult;
    let passwrodResetController;
    beforeAll(() => {
        jest.resetAllMocks();

        serviceResult = new ServiceResult({
            success: true,
            httpMethodCode: 200,
            messages: 'messages'
        });
        PasswordResetManagerService.mockImplementation(() => {
            return {
                forgetPassword: jest
                    .fn()
                    .mockReturnValue(Promise.resolve(serviceResult)),
                resetPassword: jest
                    .fn()
                    .mockReturnValue(Promise.resolve(serviceResult))
            };
        });
        passwrodResetController = require('../../../app/controllers/password-reset');
    });

    describe('Forget password', () => {
        it('should return service result.', async () => {
            const { req, res } = httpMocks.createMocks({
                body: {
                    email: 'example@example.com'
                }
            });

            await passwrodResetController.forgetPassword(req, res);
            const resData = res._getData();

            expect(res.statusCode).toBe(200);
            expect(resData.success).toBeTruthy();
            expect(resData.messages).toBe('messages');
        });

        it('should return validation errors.', async () => {
            const { req, res } = httpMocks.createMocks({});

            await passwrodResetController.forgetPassword(req, res);
            const resData = res._getData();

            expect(res.statusCode).toBe(400);
            expect(resData.success).toBeFalsy();
        });
    });

    describe('Reset password', () => {
        /* it('should return service result.', async () => {
            const { req, res } = httpMocks.createMocks({
                body: {
                    password: '12345678',
                    passwordConfirmed: '12345678'
                },
                params: {
                    token: '5c3c5dd7f8248e0cd31f0508'
                }
            });

            await passwrodResetController.resetPassword(req, res);
            const resData = res._getData();

            expect(res.statusCode).toBe(200);
            expect(resData.success).toBeTruthy();
            expect(resData.messages).toBe('messages');
        }); */

        it('should return validation errors.', async () => {
            const { req, res } = httpMocks.createMocks({});

            await passwrodResetController.resetPassword(req, res);
            const resData = res._getData();

            expect(res.statusCode).toBe(400);
            expect(resData.success).toBeFalsy();
        });
    });
});