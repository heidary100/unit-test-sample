// Result constructors - Pure Functions (They dont even throw any error), So it's ok to use them in unit tests without mocking
const ResponseMessageType = require(
    '../../../app/api-models/ResponseMessageType');
const ResponseMessage = require('../../../app/api-models/ResponseMessage');
const ServiceResult = require('../../../app/api-models/ServiceResult');

jest.mock('../../../app/services/HomeManagerService.js');
const HomeManagerService = require('../../../app/services/HomeManagerService');

const httpMocks = require('node-mocks-http');

describe('Test home controller', () => {
    let serviceResult;
    let homeController;
    beforeAll(() => {
        jest.resetAllMocks();

        serviceResult = new ServiceResult({
            success: true,
            httpMethodCode: 200,
            messages: 'messages'
        });
        HomeManagerService.mockImplementation(() => {
            return {
                search: jest
                    .fn()
                    .mockReturnValue(Promise.resolve(serviceResult))
            };
        });
        homeController = require('../../../app/controllers/home-controller');
    });
    
    describe('get /search for search in elasticsearch', () => {
        it(
            'Should get the keyword from request and return the the correct response',
            async () => {
                const newFakeSearchQuery = {
                    query: 'keyword'
                };

                const {
                    req,
                    res
                } = httpMocks.createMocks({
                    query: newFakeSearchQuery
                });

                await homeController.search(req, res);

                const resData = res._getData();

                expect(res.statusCode).toBe(200);
                expect(resData.success).toBe(true);
            });
    });
});
