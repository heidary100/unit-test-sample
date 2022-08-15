const { Reference } = require('../database/models/Reference');
const logger = require('../providers/logger-factory')(
    'Service - ReferenceManager'
);

const ServiceResult = require('../api-models/ServiceResult');
const ResponseMessage = require('../api-models/ResponseMessage');
const ResponseMessageType = require('../api-models/ResponseMessageType');
const ReferenceListDetailAdminApiModel = require('../api-models/reference/ReferenceListDetailAdminApiModel');
const DetailReferenceAdminApiModel = require('../api-models/reference/DetailReferenceAdminApiModel');
const ReferenceListDetailGuestApiModel = require('../api-models/reference/ReferenceListDetailGuestApiModel');
const DetailReferenceGuestApiModel = require('../api-models/reference/DetailReferenceGuestApiModel');

/**
 * Get references list based on the parent id for admin.
 * @param {ObjectId} parentId Parent id of reference that we want the children of it.
 * @returns List of references with the given parent id.
 */
async function getReferencesAdmin(parentId) {
    try {
        let references = await Reference.find({ parentId });
        if (!references)
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                messages: [
                    new ResponseMessage({
                        eventId: 420,
                        type: ResponseMessageType.info,
                        message: 'NO_REFERENCE_FOUND'
                    })
                ]
            });
        const result = references.map(
            reference => new ReferenceListDetailAdminApiModel(reference)
        );

        logger.info(`Sending list of references with parent id: ${parentId} .`);

        return new ServiceResult({
            result,
            totalCount: references.length,
            success: true,
            httpMethodCode: 200,
            messages: [
                new ResponseMessage({
                    eventId: 420,
                    type: ResponseMessageType.info,
                    message: 'FOUND_REFERENCES'
                })
            ]
        });
    } catch (err) {
        logger.error(`Getting references list failed > ${err.stack}`);

        return new ServiceResult({
            success: false,
            httpMethodCode: 500,
            messages: [
                new ResponseMessage({
                    eventId: -429,
                    type: ResponseMessageType.error,
                    message: 'INTERNAL_ERROR'
                })
            ]
        });
    }
}

/**
 * Add new reference to references collection.
 * @param {AddReferenceAdminApiModel} model Model for adding the reference to collection.
 */
async function addReferenceAdmin(model) {
    try {
        if (model.parentId && model.parentId !== '') {
            let parent = await Reference.findById(model.parentId);
            if (!parent) {
                logger.error(`No reference found with ${model.parentId} id.`);

                return new ServiceResult({
                    success: false,
                    httpMethodCode: 422,
                    messages: [
                        new ResponseMessage({
                            eventId: -430,
                            type: ResponseMessageType.error,
                            message: 'WRONG_PARENT_ID'
                        })
                    ]
                });
            }
        } else if (!model.parentId) delete model.parentId;

        const reference = new Reference(model);
        await reference.save();

        logger.info(`Reference added with this title: ${reference.title}.`);

        return new ServiceResult({
            success: true,
            httpMethodCode: 201,
            messages: [
                new ResponseMessage({
                    eventId: 421,
                    type: ResponseMessageType.info,
                    message: 'REFERENCE_CREATED'
                })
            ]
        });
    } catch (err) {
        logger.error(`Adding reference failed > ${err.stack}`);

        return new ServiceResult({
            success: false,
            httpMethodCode: 500,
            messages: [
                new ResponseMessage({
                    eventId: -431,
                    type: ResponseMessageType.error,
                    message: 'INTERNAL_ERROR'
                })
            ]
        });
    }
}

/**
 *  Find reference by reference id.
 * @param {number} id Id of the reference that we want to return the details of it.
 */
async function findReferenceByIdAdmin(id) {
    try {
        let reference = await Reference.findById(id)
            .populate('lastModifierUserId')
            .populate('parentId');

        if (!reference) {
            logger.error(`No reference found with id ${id}`);
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                messages: [
                    new ResponseMessage({
                        eventId: -432,
                        type: ResponseMessageType.info,
                        message: 'REFERENCE_NOT_FOUND'
                    })
                ]
            });
        }

        const result = new DetailReferenceAdminApiModel(reference);
        result.lastModifierUser = {
            userId: reference.lastModifierUserId._id,
            username: reference.lastModifierUserId.username
        };
        if (reference.parentId) {
            result.parent = {
                id: reference.parentId._id,
                title: reference.parentId.title
            };
        }

        logger.info(`Sending reference with id ${id}`);

        return new ServiceResult({
            result,
            success: true,
            httpMethodCode: 200,
            messages: [
                new ResponseMessage({
                    eventId: 422,
                    type: ResponseMessageType.info,
                    message: 'REFERENCE_FOUND'
                })
            ]
        });
    } catch (err) {
        logger.error(`Finding reference by id failed > ${err.stack}`);

        return new ServiceResult({
            success: false,
            httpMethodCode: 500,
            messages: [
                new ResponseMessage({
                    eventId: -433,
                    type: ResponseMessageType.error,
                    message: 'INTERNAL_ERROR'
                })
            ]
        });
    }
}

/**
 * Update reference by id.
 * @param {UpdateReferenceAdminApiModel} model Update reference model for adding reference to collection.
 */
async function updateReferenceByIdAdmin(model) {
    try {
        if (model.parentId) {
            let parent = await Reference.findById(model.parentId);
            if (!parent) {
                logger.error(`No reference found with ${model.parentId} id.`);

                return new ServiceResult({
                    success: false,
                    httpMethodCode: 422,
                    messages: [
                        new ResponseMessage({
                            eventId: -434,
                            type: ResponseMessageType.error,
                            message: 'WRONG_PARENT_ID'
                        })
                    ]
                });
            }
        }

        const reference = await Reference.findByIdAndUpdate(model.id, model, {
            new: true
        });
        if (!reference) {
            logger.error(
                `Failed to update: Reference not found with id ${model.id}.`
            );
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                messages: [
                    new ResponseMessage({
                        eventId: -438,
                        type: ResponseMessageType.error,
                        message: 'REFERENCE_NOT_FOUND'
                    })
                ]
            });
        }

        logger.info(`Updated reference with id ${model.id}.`);
        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            messages: [
                new ResponseMessage({
                    eventId: 423,
                    type: ResponseMessageType.info,
                    message: 'UPDATED_REFERENCE'
                })
            ]
        });
    } catch (err) {
        logger.error(`Updating reference by id failed > ${err}`);

        return new ServiceResult({
            success: false,
            httpMethodCode: 500,
            messages: [
                new ResponseMessage({
                    eventId: -435,
                    type: ResponseMessageType.error,
                    message: 'INTERNAL_ERROR'
                })
            ]
        });
    }
}

/**
 * Delete reference by id.
 * @param {number} id Id of the reference that we want to delete.
 */
async function deleteReferenceByIdAdmin(id) {
    try {
        let result = await Reference.findById(id);
        if (!result) {
            logger.warn(`Can not find reference with id ${id}`);

            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                messages: [
                    new ResponseMessage({
                        eventId: -436,
                        type: ResponseMessageType.error,
                        message: 'REFERENCE_NOT_FOUND'
                    })
                ]
            });
        }

        result = await Reference.findByIdAndDelete({ _id: id });

        logger.info(`Deleted reference with id ${id}`);

        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            messages: [
                new ResponseMessage({
                    eventId: 424,
                    type: ResponseMessageType.info,
                    message: 'DELETED'
                })
            ]
        });
    } catch (err) {
        logger.error(`Deleting reference by id failed > ${err}`);

        return new ServiceResult({
            success: false,
            httpMethodCode: 500,
            messages: [
                new ResponseMessage({
                    eventId: -437,
                    type: ResponseMessageType.error,
                    message: 'INTERNAL_ERROR'
                })
            ]
        });
    }
}

/**
 * Get references list based on the parent id for guest.
 * @param {ObjectId} parentId Parent id of reference that we want the children of it.
 * @returns List of references with the given parent id.
 */
async function getReferencesGuest(parentId) {
    try {
        let references = await Reference.find({ parentId, isEnabled: true });
        if (references.length < 1)
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                messages: [
                    new ResponseMessage({
                        eventId: 420,
                        type: ResponseMessageType.info,
                        message: 'NO_REFERENCE_FOUND'
                    })
                ]
            });
        const result = references.map(
            reference => new ReferenceListDetailGuestApiModel(reference)
        );

        logger.info(
            `Sending list of references to guest with parent id: ${parentId} .`
        );

        return new ServiceResult({
            result,
            totalCount: references.length,
            success: true,
            httpMethodCode: 200,
            messages: [
                new ResponseMessage({
                    eventId: 420,
                    type: ResponseMessageType.info,
                    message: 'FOUND_REFERENCES'
                })
            ]
        });
    } catch (err) {
        logger.error(`Getting references list failed > ${err.stack}`);

        return new ServiceResult({
            success: false,
            httpMethodCode: 500,
            messages: [
                new ResponseMessage({
                    eventId: -429,
                    type: ResponseMessageType.error,
                    message: 'INTERNAL_ERROR'
                })
            ]
        });
    }
}

/**
 *  Find reference by reference id for guest.
 * @param {number} id Id of the reference that we want to return the details of it.
 */
async function findReferenceByIdGuest(id) {
    try {
        let reference = await Reference.findById(id).populate('parentId');

        if (!reference) {
            logger.error(`No reference found with id ${id}`);
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                messages: [
                    new ResponseMessage({
                        eventId: -432,
                        type: ResponseMessageType.info,
                        message: 'REFERENCE_NOT_FOUND'
                    })
                ]
            });
        }

        const result = new DetailReferenceGuestApiModel(reference);
        if (reference.parentId) {
            result.parent = {
                id: reference.parentId._id,
                title: reference.parentId.title
            };
        } else delete result.parent;

        logger.info(`Sending reference with id ${id} to guest.`);

        return new ServiceResult({
            result,
            success: true,
            httpMethodCode: 200,
            messages: [
                new ResponseMessage({
                    eventId: 422,
                    type: ResponseMessageType.info,
                    message: 'REFERENCE_FOUND'
                })
            ]
        });
    } catch (err) {
        logger.error(`Finding reference by id for guest failed > ${err.stack}`);

        return new ServiceResult({
            success: false,
            httpMethodCode: 500,
            messages: [
                new ResponseMessage({
                    eventId: -433,
                    type: ResponseMessageType.error,
                    message: 'INTERNAL_ERROR'
                })
            ]
        });
    }
}

module.exports = {
    getReferencesAdmin,
    addReferenceAdmin,
    findReferenceByIdAdmin,
    updateReferenceByIdAdmin,
    deleteReferenceByIdAdmin,
    getReferencesGuest,
    findReferenceByIdGuest
};
