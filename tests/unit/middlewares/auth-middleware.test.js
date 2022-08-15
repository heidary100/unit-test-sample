const jwt = require('jsonwebtoken');
const authMiddleware = require('../../../app/middlewares/auth-middleware');

const httpMocks = require('node-mocks-http');

jest.mock('config');
const config = require('config');

describe('Auth middleware.', () => {
    let token;
    const user = {
        id: '123',
        roles: ['user']
    };

    beforeEach(() => {
        jest.resetAllMocks();
        config.get = jest.fn().mockReturnValue('privateKey');
        token = jwt.sign(user, config.get('jwt.privateKey'));
    });

    it('should send "NO_TOKEN_PROVIDED" for not providing any token.', () => {
        const { req, res } = httpMocks.createMocks({
            headers: {}
        });
        const next = jest.fn();

        authMiddleware()(req, res, next);
        const data = res._getData();

        expect(data.success).toBeFalsy();
        expect(data.messages[0].message).toBe('NO_TOKEN_PROVIDED');
    });

    it('should send "NO_TOKEN_PROVIDED" for not providing Berear token.', () => {
        const { req, res } = httpMocks.createMocks({
            headers: {
                authorization: token
            }
        });
        const next = jest.fn();

        authMiddleware()(req, res, next);
        const data = res._getData();

        expect(data.success).toBeFalsy();
        expect(data.messages[0].message).toBe('NO_TOKEN_PROVIDED');
    });

    it('should send "INVALID_TOKEN" for not providing valid token.', () => {
        const { req, res } = httpMocks.createMocks({
            headers: {
                authorization: `Bearer ${token}2`
            }
        });
        const next = jest.fn();

        authMiddleware()(req, res, next);
        const data = res._getData();

        expect(data.success).toBeFalsy();
        expect(data.messages[0].message).toBe('INVALID_TOKEN');
    });

    it('should send "ACCESS_DENIED" for user that doesn\'t have access.', () => {
        const { req, res } = httpMocks.createMocks({
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        const next = jest.fn();

        authMiddleware(['admin'])(req, res, next);
        const data = res._getData();

        expect(data.success).toBeFalsy();
        expect(data.messages[0].message).toBe('ACCESS_DENIED');
    });

    it('should call next middleware for user with valid token and route with no role access list.', () => {
        const { req, res } = httpMocks.createMocks({
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        const next = jest.fn();

        authMiddleware()(req, res, next);

        expect(next).toBeCalled();
        expect(req.user.id).toBe(user.id);
    });

    it('should call next middleware for user with valid token and role.', () => {
        const { req, res } = httpMocks.createMocks({
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        const next = jest.fn();

        authMiddleware([user.roles[0]])(req, res, next);

        expect(next).toBeCalled();
        expect(req.user.id).toBe(user.id);
    });
});
