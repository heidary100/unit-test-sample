const ServiceResult = require('../api-models/ServiceResult');
const ResponseMessage = require('../api-models/ResponseMessage');
const ResponseMessageType = require('../api-models/ResponseMessageType');
const filterUserFields = require('../helpers/filterUserFields');

const User = require('../database/models/User');

const loggerFactory = require('../providers/logger-factory');
const logger = loggerFactory('Service - UserManager');

/**
 * Handles user related logics
 * @class UserManager
 */
class UserManager {
    // /**
    //  * Constructor method for user manager service (used for dependency injection by jest runner)
    //  * @constructor
    //  * @param {User} model - User mongodb model used by this service
    //  */
    // constructor(User, logger) {
    //     User = User;
    //     logger = logger;
    //     logger.info('User service started ...');
    // }

    /**
     * User method for adding user
     * @param {addUserApiModel} model - An Object that represents a User Model
     * @returns {ServiceResult} - A Result for this method
     */
    static async addUser(model) {
        // Make the new user document
        const finalUser = new User(model);

        // handling password logic
        try {
            finalUser.setPassword(model.password, model.passwordConfirmed);
        } catch (error) {
            switch (error.message) {
                case 'NOT_IDENTICAL':
                    return new ServiceResult({
                        success: false,
                        httpMethodCode: 422,
                        messages: [
                            new ResponseMessage({
                                eventId: -1, // TODO
                                messageId: -1, // TODO
                                type: ResponseMessageType.error,
                                message: 'NOT_IDENTICAL_PASSWORDS'
                            })
                        ]
                    });
            }
        }

        // handling the rest of logic
        try {
            // trying to save user and if there's any error we handle it in catch section
            await finalUser.save();

            // User saved successfully!!!
            logger.info(`User added with ${model.username} username`);
            return new ServiceResult({
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
        } catch (error) {
            // TODO
            // there were problems with saving the new user reported by mongoose.
            // console.error(error);
            // for (const errName in error.errors) {
            //     console.log(errName);
            // }
            logger.error(
                error,
                'there were problems regarding registering user'
            );
            return new ServiceResult({
                success: false,
                httpMethodCode: 422,
                messages: [
                    new ResponseMessage({
                        eventId: -1,
                        messageId: 1,
                        type: ResponseMessageType.error,
                        message: 'BAD_REQUEST'
                    })
                ]
            });
        }
    }

    /**
     * User method for updating a user by id
     * @param {updateUserAPIModel} model - An Object that represents a User Model
     * @returns {ServiceResult} - A Result for this method
     */
    static async updateUserById(model) {
        const { id, ...updatedFieldsModel } = model;

        try {
            let user = filterUserFields(
                await User.findByIdAndUpdate(
                    id,
                    updatedFieldsModel,

                    {
                        new: true
                    }
                ).lean()
            );

            if (!user) {
                logger.error(`No user found with ${model.id} id.`);

                return new ServiceResult({
                    success: false,
                    httpMethodCode: 404,
                    messages: [
                        new ResponseMessage({
                            eventId: -1,
                            messageId: -1, // TODO
                            type: ResponseMessageType.error,
                            message: 'WRONG_USERID' // TODO
                        })
                    ]
                });
            }

            logger.info(`Updated User with id ${model.id}.`);

            return new ServiceResult({
                success: true,
                httpMethodCode: 200,
                messages: [
                    new ResponseMessage({
                        type: ResponseMessageType.info,
                        eventId: 10, // TODO
                        messageId: 1, // TODO
                        message: 'USER_UPDATED' // TODO
                    })
                ]
            });
        } catch (error) {
            logger.error(`Updating User by id failed > ${error}`);

            return new ServiceResult({
                success: false,
                httpMethodCode: 400,
                messages: [
                    new ResponseMessage({
                        eventId: -1, // TODO
                        messageId: -1, // TODO
                        type: ResponseMessageType.error,
                        message: 'BAD_REQUEST'
                    })
                ]
            });
        }
    }

    /**
     * User method for adding user
     * @param {QueryAPIModel} model - An Object that represents a User Model
     * @returns {ServiceResult} - A Result for this method
     */
    static async getUsers({ limit, offset }) {
        try {
            let users = (await User.find({})
                .skip(offset)
                .limit(limit)
                .lean()).map(filterUserFields);

            logger.info(
                `Sending list of users with offset:${offset} and limit:${limit}`
            );

            return new ServiceResult({
                result: users,
                success: true,
                httpMethodCode: 200,
                messages: [
                    new ResponseMessage({
                        eventId: -1, // TODO
                        messageId: -1, // TODO
                        type: ResponseMessageType.info,
                        message: 'USERS_FOUND' // TODO
                    })
                ]
            });
        } catch (err) {
            logger.error(`Getting users list failed unexpextedly!! > ${err}`);

            return new ServiceResult({
                success: false,
                httpMethodCode: 500,
                messages: [
                    new ResponseMessage({
                        eventId: -1, // TODO
                        messageId: -1, // TODO
                        type: ResponseMessageType.error,
                        message: 'SERVER_ERROR'
                    })
                ]
            });
        }
    }

    /**
     * User method for getting a user by id
     * @param {id} id - User Id
     * @returns {ServiceResult} - A Result for this method
     */
    static async getUserById(id) {
        try {
            let user = filterUserFields(await User.findByIdWithCache(id));
            if (!user) {
                logger.error(`Didn't get user by id > ${id}`);

                return new ServiceResult({
                    success: false,
                    httpMethodCode: 404,
                    messages: [
                        new ResponseMessage({
                            eventId: -1, // TODO
                            messageId: -1, // TODO
                            type: ResponseMessageType.error,
                            message: 'NOT_FOUND' // TODO
                        })
                    ]
                });
            } else {
                logger.info(`Sending User with id ${id}`);

                return new ServiceResult({
                    result: user,
                    success: true,
                    httpMethodCode: 200,
                    messages: [
                        new ResponseMessage({
                            eventId: -1, // TODO
                            messageId: -1, // TODO
                            type: ResponseMessageType.info,
                            message: 'USER_FOUND' // TODO
                        })
                    ]
                });
            }
        } catch (error) {
            logger.error(
                `Getting User by id failed unexpectedly!!! > ${error}`
            );

            return new ServiceResult({
                success: false,
                httpMethodCode: 500,
                messages: [
                    new ResponseMessage({
                        eventId: -1, // TODO
                        messageId: -1, // TODO
                        type: ResponseMessageType.error,
                        message: 'SERVER_ERROR'
                    })
                ]
            });
        }
    }

    /**
     * User method for deleting a user by id
     * @param {id} id - User Id
     * @returns {ServiceResult} - A Result for this method
     */
    static async delUserById(id) {
        try {
            let result = await User.findByIdAndDelete(id);

            if (!result) {
                logger.info(
                    `No user with id ${id} has been found for deleting.`
                );

                return new ServiceResult({
                    success: false,
                    httpMethodCode: 404,
                    messages: [
                        new ResponseMessage({
                            eventId: -1, // TODO
                            messageId: -1, // TODO
                            type: ResponseMessageType.error,
                            message: 'USER_NOT_FOUND' // TODO
                        })
                    ]
                });
            } else {
                logger.info(`Deleted User with id ${id}`);

                return new ServiceResult({
                    success: true,
                    httpMethodCode: 200,
                    messages: [
                        new ResponseMessage({
                            eventId: -1, // TODO
                            messageId: -1, // TODO
                            type: ResponseMessageType.info,
                            message: 'USER_DELETED' // TODO
                        })
                    ]
                });
            }
        } catch (err) {
            logger.error(`Deleting User by id failed unexpectedly!!! > ${err}`);

            return new ServiceResult({
                success: false,
                httpMethodCode: 500,
                messages: [
                    new ResponseMessage({
                        eventId: -1, // TODO
                        messageId: -1, // TODO
                        type: ResponseMessageType.error,
                        message: 'SERVER_ERROR' // TODO
                    })
                ]
            });
        }
    }
}

module.exports = UserManager;
