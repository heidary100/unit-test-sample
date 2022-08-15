const ServiceResult = require('../api-models/ServiceResult');
const ResponseMessage = require('../api-models/ResponseMessage');
const ResponseMessageType = require('../api-models/ResponseMessageType');

/**
 * Creates a new Subject.
 * @class SubjectManager
 */
class SubjectManager {

    /**
     * Constructor method for subject manager service to set models for service
     * @constructor
     * @param {models} models mongodb models that this service has access to
     */
    constructor(Subject, logger) {
        this.Subject = Subject;
        this.logger = logger;
        this.logger.info('Service started ...');
    }

    /**
     * AddSubject method for adding subject
     * @param {addSubjectApiModel} addSubjectApiModel - Add subject api model mapped from request body
     * @returns {ServiceResult} - Returns an instance of ServiceResult
     */
    async addSubject(addSubjectApiModel) {

        try {

            let existedSubject = await this.Subject.findOne(
                { title: addSubjectApiModel.title }
            );

            if (existedSubject) {

                this.logger.info(`Subject already exists with ${addSubjectApiModel.title} title`);

                return new ServiceResult({
                    success: false,
                    httpMethodCode: 501,
                    messages: [
                        new ResponseMessage({
                            eventId: -307,
                            type: ResponseMessageType.error,
                            message: 'TITLE_EXISTS'
                        })
                    ]
                });
            } else {

                let subject = new this.Subject(addSubjectApiModel);

                subject = await subject.save();

                this.logger.info(`Subject added with ${subject.title} title`);

                return new ServiceResult({
                    success: true,
                    httpMethodCode: 201,
                    messages: [
                        new ResponseMessage({
                            eventId: 308,
                            type: ResponseMessageType.info,
                            message: 'SUBJECT_ADDED'
                        })
                    ]
                });
            }
        } catch (exception) {

            this.logger.info(`Adding subject failed with ${exception}`);

            return new ServiceResult({
                success: false,
                httpMethodCode: 400,
                messages: [
                    new ResponseMessage({
                        eventId: -309,
                        type: ResponseMessageType.error,
                        message: 'BAD_REQUEST'
                    })
                ]
            });
        }
    }

    /**
     * Find subject by id
     * @param {number} id of subject
     * @returns {ServiceResult} - Returns an instance of ServiceResult
     */
    async findSubjectById(id) {

        try{

            let subject = await this.Subject.findById(id);
            if(!subject) {
                this.logger.info(`No subject found with id ${id}`);
                return new ServiceResult({
                    success: false,
                    httpMethodCode: 404,
                    messages: [
                        new ResponseMessage({
                            eventId: -310,
                            type: ResponseMessageType.error,
                            message: 'SUBJECT_NOT_FOUND'
                        })
                    ]
                });
            }

            return new ServiceResult({
                result: subject,
                success: true,
                httpMethodCode: 200,
                messages: [
                    new ResponseMessage({
                        eventId: 311,
                        type: ResponseMessageType.info,
                        message: 'SUBJECT_FOUND'
                    })
                ]
            });
        
        } catch (exception) {

            this.logger.info(`Finding subject by id failed with ${exception}`);

            return new ServiceResult({
                success: false,
                httpMethodCode: 400,
                messages: [
                    new ResponseMessage({
                        eventId: -312,
                        type: ResponseMessageType.error,
                        message: 'BAD_REQUEST'
                    })
                ]
            }); 
        }
    }

    /**
     * Update subject by id
     * @param {updateSubjectApiModel} updateSubjectApiModel - Update subject api model
     * @returns {ServiceResult} - Returns an instance of ServiceResult
     */
    async updateSubjectById (updateSubjectApiModel) {

        try {
            let result = await this.Subject.findById(updateSubjectApiModel.id);
            if(!result) {
                this.logger.warn(`Can not find subject with id ${updateSubjectApiModel.id}`);
                return new ServiceResult({
                    success: false,
                    httpMethodCode: 404,
                    messages: [
                        new ResponseMessage({
                            eventId: -313,
                            type: ResponseMessageType.error,
                            message: 'SUBJECT_NOT_FOUND'
                        })
                    ]
                });
            }

            let subject = await this.Subject.findByIdAndUpdate(
                { _id : updateSubjectApiModel.id }, 
                updateSubjectApiModel
            );

            this.logger.info(`Updated subject with id ${updateSubjectApiModel.id}.`);

            return new ServiceResult({
                success: true,
                httpMethodCode: 200,
                messages: [
                    new ResponseMessage({
                        eventId: 314,
                        type: ResponseMessageType.info,
                        message: 'SUBJECT_UPDATED'
                    })
                ]
            });
        
        } catch (exception) {

            this.logger.info(`Updating subject by id failed with ${exception}`);

            return new ServiceResult({
                success: false,
                httpMethodCode: 400,
                messages: [
                    new ResponseMessage({
                        eventId: -315,
                        type: ResponseMessageType.error,
                        message: 'BAD_REQUEST'
                    })
                ]
            });
        }
    }

    /**
     * Delete subject by id
     * @param {number} id of subject that want to delete
     * @returns {ServiceResult} - Returns an instance of ServiceResult
     */
    async deleteSubjectById (id) {

        try {
            let result = await this.Subject.findById(id);
            if(!result) {
                this.logger.warn(`Can not find subject with id ${id}`);
                return new ServiceResult({
                    success: false,
                    httpMethodCode: 404,
                    messages: [
                        new ResponseMessage({
                            eventId: -316,
                            type: ResponseMessageType.error,
                            message: 'SUBJECT_NOT_FOUND'
                        })
                    ]
                });
            }

            result = await this.Subject.findByIdAndDelete(
                { _id : id }
            );

            this.logger.info(`Deleted subject with id ${id}`);

            return new ServiceResult({
                success: true,
                httpMethodCode: 200,
                messages: [
                    new ResponseMessage({
                        eventId: 317,
                        type: ResponseMessageType.error,
                        message: 'SUBJECT_DELETED'
                    })
                ]
            });
        
        } catch (exception) {
 
            this.logger.info(`Deleting subject by id failed with ${exception}`);

            return new ServiceResult({
                success: false,
                httpMethodCode: 400,
                messages: [
                    new ResponseMessage({
                        eventId: -318,
                        type: ResponseMessageType.error,
                        message: 'BAD_REQUEST'
                    })
                ]
            });   
        }
    }

    /**
     * get list of subject with pagination
     * @param {offset, limit}
     * @returns {ServiceResult} - Returns an instance of ServiceResult
     */
    async getSubjects(limit, offset = 0) {
        if(!limit)
            return new ServiceResult({
	        	success: false,            
				httpMethodCode: 400,
				messages: [       
					new ResponseMessage({
	                	eventId: -319,
                        type: ResponseMessageType.error,
                        message: 'LIMIT_NOT_PROVIDED'
                    })
			    ] 
			});

        if(!offset) offset = 0;

	    if(offset < 0 || limit < 0)
            return new ServiceResult({
	        	success: false,            
				httpMethodCode: 400,
				messages: [       
					new ResponseMessage({
	                	eventId: -320,
                        type: ResponseMessageType.error,
                        message: 'INVALID_LIMIT_OR_OFFSET'
                    })
			    ] 
			});

        if(limit > 100) limit = 100;

        try {

            let subjects = await this.Subject.find({})
                .skip(offset)
                .limit(limit);

            this.logger.info(`Sending list of subjects with offset:${offset} and limit:${limit}`);

            return new ServiceResult({
                result: subjects,
                success: true,
                httpMethodCode: 200,
                messages: [
                    new ResponseMessage({
                        eventId: 321,
                        type: ResponseMessageType.error,
                        message: 'SUBJECTS_FOUND'
                    })
                ]
            });
        } catch (exception) {
            this.logger.info(`Getting subject by id failed with ${exception}`);

            return new ServiceResult({
                success: false,
                httpMethodCode: 400,
                messages: [
                    new ResponseMessage({
                        eventId: -322,
                        type: ResponseMessageType.error,
                        message: 'BAD_REQUEST'
                    })
                ]
            });
        }
    }
}

module.exports = SubjectManager;
