jest.mock('../../../app/services/ReferenceManagerService');
const ReferenceManagerService = require('../../../app/services/ReferenceManagerService');

const httpMocks = require('node-mocks-http');

const ServiceResult = require('../../../app/api-models/ServiceResult');
const manageReferencesController = require('../../../app/controllers/references-controller');

describe('Controller route /references', () => {
    let serviceResult = new ServiceResult({
        success: true,
        httpMethodCode: 200,
        messages: 'messages'
    });
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('Get references', () => {
        beforeEach(() => {
            ReferenceManagerService.getReferencesGuest = jest
                .fn()
                .mockReturnValue(Promise.resolve(serviceResult));
        });
        it('should return service result.', async () => {
            const { req, res } = httpMocks.createMocks({});

            await manageReferencesController.getReferences(req, res);
            const resData = res._getData();

            expect(res.statusCode).toBe(serviceResult.httpMethodCode);
            expect(resData.success).toBe(serviceResult.success);
            expect(resData.messages).toBe(serviceResult.messages);
        });

        it('should return validation errors.', async () => {
            const { req, res } = httpMocks.createMocks({
                query: { parentId: 'unvalidId' }
            });

            await manageReferencesController.getReferences(req, res);
            const resData = res._getData();

            expect(res.statusCode).toBe(400);
            expect(resData.success).toBeFalsy();
        });
    });

    describe('Find reference by id', () => {
        beforeEach(() => {
            ReferenceManagerService.findReferenceByIdGuest = jest
                .fn()
                .mockReturnValue(Promise.resolve(serviceResult));
        });

        it('should return service result.', async () => {
            let { req, res } = httpMocks.createMocks({
                params: {
                    id: '123456abc34583716ffabc43'
                }
            });

            await manageReferencesController.findReferenceById(req, res);
            const resData = res._getData();

            expect(res.statusCode).toBe(200);
            expect(resData.success).toBeTruthy();
            expect(resData.messages).toBe('messages');
        });

        it('should return validation errors.', async () => {
            const { req, res } = httpMocks.createMocks({});

            await manageReferencesController.findReferenceById(req, res);
            const resData = res._getData();

            expect(res.statusCode).toBe(400);
            expect(resData.success).toBeFalsy();
        });
    });
});
