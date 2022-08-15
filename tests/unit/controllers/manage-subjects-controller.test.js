const ServiceResult = require('../../../app/api-models/ServiceResult');

jest.mock('../../../app/services/SubjectManagerService.js');
const SubjectManagerService = require('../../../app/services/SubjectManagerService');

const httpMocks = require('node-mocks-http');

describe('Controller route /manage/subjects', () => {
    let serviceResult;
    let manageSubjectsController;
    beforeAll(() => {
        jest.resetAllMocks();

        serviceResult = new ServiceResult({
            success: true,
            httpMethodCode: 200,
            messages: 'messages'
        });
        SubjectManagerService.mockImplementation(() => {
            return {
                getSubjects: jest
                    .fn()
                    .mockReturnValue(Promise.resolve(serviceResult)),
                addSubject: jest
                    .fn()
                    .mockReturnValue(Promise.resolve(serviceResult)),
                findSubjectById: jest
                    .fn()
                    .mockReturnValue(Promise.resolve(serviceResult)),
                updateSubjectById: jest
                    .fn()
                    .mockReturnValue(Promise.resolve(serviceResult)),
                deleteSubjectById: jest
                    .fn()
                    .mockReturnValue(Promise.resolve(serviceResult))
            };
        });
        manageSubjectsController = require('../../../app/controllers/manage-subjects-controller');
    });

    describe('Get subjects', () => {
        it('should return service result.', async () => {
            const { req, res } = httpMocks.createMocks({
                query: {
                    limit: 10,
                    offset: 1,
                    query: 'text'
                }
            });

            await manageSubjectsController.getSubjects(req, res);
            const resData = res._getData();

            expect(res.statusCode).toBe(200);
            expect(resData.success).toBeTruthy();
            expect(resData.messages).toBe('messages');
        });
    });

    describe('Add subjects', () => {
        it('should return service result.', async () => {
            let { req, res } = httpMocks.createMocks({
                body: {
                    title: 'title',
                    text: 'text',
                    priorityOrder: 1,
                    isEnabled: true
                }
            });
            req.user = { id: '123456abc34583716ffabc43' };

            await manageSubjectsController.addSubject(req, res);
            const resData = res._getData();

            expect(res.statusCode).toBe(200);
            expect(resData.success).toBeTruthy();
            expect(resData.messages).toBe('messages');
        });

        it('should return validation errors.', async () => {
            const { req, res } = httpMocks.createMocks({});

            await manageSubjectsController.addSubject(req, res);
            const resData = res._getData();

            expect(res.statusCode).toBe(400);
            expect(resData.success).toBeFalsy();
        });
    });

    describe('Find subject by id', () => {
        it('should return service result.', async () => {
            let { req, res } = httpMocks.createMocks({
                params: {
                    id: '123456abc34583716ffabc43'
                }
            });

            await manageSubjectsController.findSubjectById(req, res);
            const resData = res._getData();

            expect(res.statusCode).toBe(200);
            expect(resData.success).toBeTruthy();
            expect(resData.messages).toBe('messages');
        });

        it('should return validation errors.', async () => {
            const { req, res } = httpMocks.createMocks({});

            await manageSubjectsController.findSubjectById(req, res);
            const resData = res._getData();

            expect(res.statusCode).toBe(400);
            expect(resData.success).toBeFalsy();
        });
    });

    describe('Update subject by id', () => {
        it('should return service result.', async () => {
            let { req, res } = httpMocks.createMocks({
                body: {
                    title: 'title',
                    priorityOrder: 1,
                    isEnabled: true
                },
                params: {
                    id: '123456abc34583716ffabc43'
                }
            });
            req.user = { id: '123456abc34583716ffabc43' };

            await manageSubjectsController.updateSubjectById(req, res);
            const resData = res._getData();

            expect(res.statusCode).toBe(200);
            expect(resData.success).toBeTruthy();
            expect(resData.messages).toBe('messages');
        });

        it('should return validation errors.', async () => {
            const { req, res } = httpMocks.createMocks({});

            await manageSubjectsController.updateSubjectById(req, res);
            const resData = res._getData();

            expect(res.statusCode).toBe(400);
            expect(resData.success).toBeFalsy();
        });
    });

    describe('Delete subject by id', () => {
        it('should return service result.', async () => {
            let { req, res } = httpMocks.createMocks({
                params: {
                    id: '123456abc34583716ffabc43'
                }
            });

            await manageSubjectsController.deleteSubjectById(req, res);
            const resData = res._getData();

            expect(res.statusCode).toBe(200);
            expect(resData.success).toBeTruthy();
            expect(resData.messages).toBe('messages');
        });

        it('should return validation errors.', async () => {
            const { req, res } = httpMocks.createMocks({});

            await manageSubjectsController.deleteSubjectById(req, res);
            const resData = res._getData();

            expect(res.statusCode).toBe(400);
            expect(resData.success).toBeFalsy();
        });
    });
});