const jwt = require('jsonwebtoken');
const authSocketMiddleware = require('../../../app/middlewares/auth-socket-middleware');

jest.mock('config');

const config = require('config');
config.get = jest.fn().mockReturnValue('privateKey');
const token = jwt.sign({ id: '123' }, config.get('privateKey'));


describe('Auth socket middleware.', () => {
    it('should return false to callback for not providing Bearer token.', () => {
        const info = { req: { headers: { authorization: token } } };
        const done = jest.fn();
        authSocketMiddleware(info, done);

        expect(done).toBeCalledWith(false);
    });

    it('should return false to callback for not providing valid token.', () => {
        const info = { req: { headers: { authorization: `Bearer ${token}tokenDestructor` } } };
        const done = jest.fn();
        authSocketMiddleware(info, done);

        expect(done).toBeCalledWith(false);
    });

    it('should return true to callback for providing valid token.', () => {
        const info = { req: { headers: { authorization: `Bearer ${token}` } } };
        const done = jest.fn();
        authSocketMiddleware(info, done);

        expect(done).toBeCalledWith(true);
    });
});