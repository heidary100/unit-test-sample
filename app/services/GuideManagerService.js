const { Guide } = require('../database/models/Guide');

const ServiceResult = require('../api-models/ServiceResult');
const ResponseMessage = require('../api-models/ResponseMessage');
const ResponseMessageType = require('../api-models/ResponseMessageType');

// Log
const loggerFactory = require('../providers/logger-factory');
const serviceLogger = loggerFactory('Service - GuideManager');

class GuideManager {
    static async addGuide(model) {
        const finalGuide = new Guide(model);
        try {
            await finalGuide.save();
            serviceLogger.info(`Guide added with ${model.title} title`);
            return new ServiceResult({
                success: true,
                httpMethodCode: 200,
                messages: [
                    new ResponseMessage({
                        eventId: -1,
                        messageId: 18,
                        type: ResponseMessageType.info,
                        message: 'GUIDE_ADDED'
                    })
                ]
            });
        } catch (error) {
            serviceLogger.error(`didn't manage to save Guide, error: ${error}`);
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

    static async getGuides({ limit, offset }) {
        try {
            let guides = await Guide.find({})
                .skip(offset)
                .limit(limit);
            serviceLogger.info(
                `Sending list of guides with offset:${offset} and limit:${limit}`
            );

            return new ServiceResult({
                result: guides,
                success: true,
                httpMethodCode: 200,
                messages: [
                    new ResponseMessage({
                        eventId: -1, // TODO
                        messageId: -1, // TODO
                        type: ResponseMessageType.info,
                        message: 'GUIDES_FOUND' // TODO
                    })
                ]
            });
        } catch (err) {
            serviceLogger.error(
                `Getting guides list failed unexpextedly!! > ${err}`
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

    static async findGuideById(id) {
        let guide = await Guide.findByIdWithCache(id);
        try {
            if (!guide) {
                serviceLogger.error(`Didn't get guide by id > ${id}`);

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
                serviceLogger.info(`Sending guide with id ${id}`);

                return new ServiceResult({
                    result: guide,
                    success: true,
                    httpMethodCode: 200,
                    messages: [
                        new ResponseMessage({
                            eventId: -1, // TODO
                            messageId: -1, // TODO
                            type: ResponseMessageType.info,
                            message: 'GUIDE_FOUND' // TODO
                        })
                    ]
                });
            }
        } catch (error) {
            serviceLogger.error(
                `Getting guide by id failed unexpectedly!!! > ${error}`
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

    static async updateGuideById(model) {
        const { id, ...updatedFieldsModel } = model;

        try {
            let guide = await Guide.findByIdAndUpdate(id, updatedFieldsModel, {
                new: true
            });

            if (!guide) {
                serviceLogger.error(`No guide found with ${model.id} id.`);

                return new ServiceResult({
                    success: false,
                    httpMethodCode: 404,
                    messages: [
                        new ResponseMessage({
                            eventId: -1,
                            messageId: -1, // TODO
                            type: ResponseMessageType.error,
                            message: 'WRONG_GUIDEID' // TODO
                        })
                    ]
                });
            }

            serviceLogger.info(`Updated guide with id ${model.id}.`);

            return new ServiceResult({
                success: true,
                httpMethodCode: 200,
                messages: [
                    new ResponseMessage({
                        type: ResponseMessageType.info,
                        eventId: 10, // TODO
                        messageId: 1, // TODO
                        message: 'GUIDE_UPDATED' // TODO
                    })
                ]
            });
        } catch (error) {
            // serviceLogger.error(`Updating guide by id failed > ${error}`);
            console.error('Error: ', error);

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

    static async deleteGuideById(id) {
        try {
            let result = await Guide.findByIdAndDelete(id);

            if (!result) {
                serviceLogger.info(
                    `No guide with id ${id} has been found for deleting.`
                );

                return new ServiceResult({
                    success: false,
                    httpMethodCode: 404,
                    messages: [
                        new ResponseMessage({
                            eventId: -1, // TODO
                            messageId: -1, // TODO
                            type: ResponseMessageType.error,
                            message: 'GUIDE_NOT_FOUND' // TODO
                        })
                    ]
                });
            } else {
                serviceLogger.info(`Deleted guide with id ${id}`);

                return new ServiceResult({
                    success: true,
                    httpMethodCode: 200,
                    messages: [
                        new ResponseMessage({
                            eventId: -1, // TODO
                            messageId: -1, // TODO
                            type: ResponseMessageType.info,
                            message: 'GUIDE_DELETED' // TODO
                        })
                    ]
                });
            }
        } catch (err) {
            serviceLogger.error(
                `Deleting guide by id failed unexpectedly!!! > ${err}`
            );

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

module.exports = GuideManager;
