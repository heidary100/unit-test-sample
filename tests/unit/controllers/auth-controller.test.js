const authController = require('../../../app/controllers/auth-controller');
const ServiceResult = require('../../../app/api-models/ServiceResult');

jest.mock('../../../app/services/AuthManagerService');
const AuthManagerService = require('../../../app/services/AuthManagerService');

const httpMocks = require('node-mocks-http');

describe('Controller route /login', () => {
    const serviceResult = new ServiceResult({
        success: true,
        httpMethodCode: 200,
        messages: 'messages'
    });

    beforeEach(() => {
        jest.resetAllMocks();

        AuthManagerService.loginWithUsername = jest
            .fn()
            .mockReturnValue(Promise.resolve(serviceResult));
    });

    describe('Login', () => {
        it('should return service result.', async () => {
            const { req, res } = httpMocks.createMocks({
                body: {
                    username: 'username',
                    password: 'password'
                }
            });

            req.connection = {
                remoteAddress: '::1'
            };

            await authController.login(req, res);
            const resData = res._getData();

            expect(res.statusCode).toBe(serviceResult.httpMethodCode);
            expect(resData.success).toBe(serviceResult.success);
            expect(resData.messages).toBe(serviceResult.messages);
        });

        it('should return validation errors.', async () => {
            const { req, res } = httpMocks.createMocks({});

            await authController.login(req, res);
            const resData = res._getData();

            expect(res.statusCode).toBe(400);
            expect(resData.success).toBeFalsy();
        });
    });
});
