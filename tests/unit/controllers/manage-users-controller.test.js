// Result constructors - Pure Functions (They dont even throw any error), So it's ok to use them in unit tests without mocking
const ResponseMessageType = require('../../../app/api-models/ResponseMessageType');
const ResponseMessage = require('../../../app/api-models/ResponseMessage');
const ServiceResult = require('../../../app/api-models/ServiceResult');

// Mocking the User Manager service used by controller
// Souhld be mocked because of network usage
jest.mock('../../../app/services/UserManagerService.js');
const UserManagerService = require('../../../app/services/UserManagerService');

// the module used for mocking http requests and reponses
// passed to our controller by http server (express)
const httpMocks = require('node-mocks-http');

// Directly importing controllers for testing them.
const {
    addUser,
    delUserById,
    getUserById,
    getUsers,
    updateUserById
} = require('../../../app/controllers/manage-users-controller');

describe('Test manage/users controller', () => {
    // Cleaning our mock functions before each test
    // so we can be pretty sure of independece of tests
    // on each other's results
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('post / for adding new users', () => {
        // make sure to pass an async function as callback because of using await
        it('Should create a user successfully and return the the correct response', async () => {
            // making our desired repsonse from our mocked service function
            const fakeServiceResult = new ServiceResult({
                success: true,
                httpMethodCode: 200,
                messages: [
                    new ResponseMessage({
                        eventId: -1,
                        messageId: 18,
                        type: ResponseMessageType.info,
                        message: 'USER_ADDED'
                    })
                ]
            });

            // telling our mocked module to return our designated result only once
            // as a resolved promise(becuase all of our service functions are async/await)
            UserManagerService.addUser.mockResolvedValueOnce(fakeServiceResult);

            // More info about jest mocked function's methods
            // https://jestjs.io/docs/en/mock-function-api

            // the fake user that's gonna be passed as body of req
            // to our controller
            // depends on the specification of controller
            // based on swagger
            const newFakeUserBody = {
                firstName: 'Peg',
                lastName: 'Lecky',
                username: 'plecky5',
                email: 'plecky5@wiley.com',
                phoneNumber: '6167944866',
                password: 'passnCO5mqar',
                passwordConfirmed: 'passnCO5mqar'
            };

            // creating req and res passed to our controller
            const { req, res } = httpMocks.createMocks({
                body: newFakeUserBody
            });

            // More info about httpMocks
            // https://github.com/howardabrams/node-mocks-http

            // letting the controller finish up its work
            // with our req and res
            // and then asserting our expectaions
            // on req and res objects
            await addUser(req, res);

            // our response body data
            const resData = res._getData();

            // Uncomment these two linee to see all the
            // properties and methods that can be used
            // on the reponse and req returned by our controller

            // console.log(res);
            // console.log(req);

            // Checking our constraints
            expect(res.statusCode).toBe(200);
            expect(resData.success).toBe(true);
            expect(resData.messages[0].message).toBe('USER_ADDED');

            // asserting our mocked functions

            // Only one call to our mocked function
            expect(UserManagerService.addUser.mock.calls.length).toBe(1);

            // our mocked function (Service) has returned normally
            expect(UserManagerService.addUser.mock.results[0].type).toBe(
                'return'
            );
        });
    });
});
