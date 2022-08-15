const ServiceResult = require('../api-models/ServiceResult');
const ResponseMessage = require('../api-models/ResponseMessage');
const ResponseMessageType = require('../api-models/ResponseMessageType');

/**
 * Handles Serach in elastic related logics
 * @class HomeManagerService
 */
class HomeManagerService {
    /**
     * Constructor method for home manager service (used for dependency injection by jest runner)
     * @constructor
     * @param {elasticsearch} module elasticsearch provider module
     * @param {Logger} logger an instance of logger
     */
    constructor(elasticsearch, logger) {
        this.elasticsearch = elasticsearch;
        this.logger = logger;
        this.logger.info('Home service started ...');
    }

    /**
     * Search method for search in elasticsearch
     * @param {keyword} model - A String as a search keyword
     * @returns {ServiceResult} - A Result for this method
     */
    async search(keyword) {
        try {
            // Send data to Provider
            const result = await this.elasticsearch.searchInElastic(keyword);

            // Sending the result
            this.logger.info(`Search found with ${keyword} keyword`);
            
            if(result.length == 0){
                return new ServiceResult({
                    success: false,
                    result,
                    httpMethodCode: 404,
                    messages: [
                        new ResponseMessage({
                            eventId: -1,
                            messageId: 18,
                            type: ResponseMessageType.info,
                            message: 'SEARCH_RESULT_NOT_FOUND'
                        })
                    ]
                });
            }else{
                return new ServiceResult({
                    success: true,
                    result,
                    httpMethodCode: 200,
                    messages: [
                        new ResponseMessage({
                            eventId: -1,
                            messageId: 18,
                            type: ResponseMessageType.info,
                            message: 'SEARCH_RESULT_FOUND'
                        })
                    ]
                });
            }
           
        } catch (error) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 422,
                messages: [
                    new ResponseMessage({
                        eventId: -1, // TODO
                        messageId: -1, // TODO
                        type: ResponseMessageType.error,
                        message: 'BAD_REQUEST'
                    })
                ],
                exception: error
            });
        }
    }
}

module.exports = HomeManagerService;
