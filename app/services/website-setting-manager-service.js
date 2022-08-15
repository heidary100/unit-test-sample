const ServiceResult = require('../api-models/ServiceResult');
// API Models
const ResponseMessage = require('../api-models/ResponseMessage');
const ResponseMessageType = require('../api-models/ResponseMessageType');
const DetailWebsiteSettingAdminApiModel = require('../api-models/website-setting/DetailWebsiteSettingAdminApiModel');
const DetailWebsiteSettingGuestApiModel = require('../api-models/website-setting/DetailWebsiteSettingGuestApiModel');

const WebsiteSetting = require('../database/models/WebsiteSetting');
const loggerFactory = require('../providers/logger-factory');
const logger = loggerFactory('Service - website-setting-manager');
const messages = require('../api-models/messages.json');

/**
 * @method getWebsiteSetting method for getting WebsiteSetting
 * @returns {ServiceResult} - A Result for this method
 */
async function getWebsiteSetting() {
    try {
        let websiteSetting = await WebsiteSetting.find({});
        if (websiteSetting.length === 0) {
            logger.error('No WebsiteSettings found');

            let addWebsiteSettingResult = await addWebsiteSetting({});
            if (addWebsiteSettingResult.success) {
                websiteSetting = addWebsiteSettingResult.result;
            } else {
                throw addWebsiteSettingResult.exception;
            }
        } else {
            websiteSetting = websiteSetting[0];
        }
        logger.info('WebsiteSetting found');
        let detailWebsiteSettingAdminApiModel = new DetailWebsiteSettingAdminApiModel(websiteSetting);

        return new ServiceResult({
            result: detailWebsiteSettingAdminApiModel,
            success: true,
            httpMethodCode: 200,
            messages: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.info,
                    message: messages['WEBSITE_SETTING_FOUND']
                })
            ]
        });

    } catch (error) {
        logger.error(`Getting WebsiteSetting failed >\n ${error.stack}`);

        return new ServiceResult({
            success: false,
            httpMethodCode: 500,
            messages: [
                new ResponseMessage({
                    eventId: 201,
                    type: ResponseMessageType.error,
                    message: messages['INTERNAL_SERVER_ERROR']
                })
            ]
        });
    }
}

/**
 * @method updateWebsiteSetting method for updating website setting
 * @param {UpdateWebsiteSettingAdminApiModel} model  An Object that represents a UpdateWebsiteSettingAdminApiModel API Model
 * @returns {ServiceResult} A Result for this method
 */
async function updateWebsiteSetting(model) {
    try {
        let websiteSetting = await WebsiteSetting.find({});

        if (websiteSetting.length === 0) {
            logger.error('No WebsiteSetting found');

            let addWebsiteSettingResult = await addWebsiteSetting(model);
            if (addWebsiteSettingResult.success) {
                websiteSetting = addWebsiteSettingResult.result;
            } else {
                throw addWebsiteSettingResult.exception;
            }
        } else {
            websiteSetting = websiteSetting[0];
            await websiteSetting.set(model).save();

            logger.info('WebsiteSetting has been updated.');
        }

        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            messages: [
                new ResponseMessage({
                    eventId: 202,
                    type: ResponseMessageType.info,
                    message: messages['WEBSITE_SETTING_UPDATED']
                })
            ]
        });
    } catch (error) {
        logger.error(`Updating WebsiteSetting failed >\n ${error.stack}`);

        return new ServiceResult({
            success: false,
            exception: error,
            httpMethodCode: 400,
            messages: [
                new ResponseMessage({
                    eventId: 203,
                    type: ResponseMessageType.error,
                    message: messages['INTERNAL_SERVER_ERROR']
                })
            ]
        });
    }
}

/**
 * @method addWebsiteSetting method for adding website setting
 * @param {UpdateWebsiteSettingApiModel} model An Object that represents a UpdateWebsiteSettingApiModel API Model
 * @returns {ServiceResult} - A Result for this method
 */
async function addWebsiteSetting(model) {
    try {
        if (model.title === undefined) {
            model.title = 'We Will Guide You';
        }
        if (model.contactUsText === undefined) {
            model.contactUsText = 'Contact Us Text';
        }
        if (model.aboutUsText === undefined) {
            model.aboutUsText = 'About Us Text';
        }
        if (model.description === undefined) {
            model.description = 'Description Text';
        }
        if (model.keywords !== undefined) {
            model.keywords = ['guide', 'reference', 'we', 'will', 'you'];
        }

        let websiteSetting = new WebsiteSetting(model);

        websiteSetting = await websiteSetting.save();

        logger.info(`WebsiteSetting added with ${websiteSetting.title} title`);

        return new ServiceResult({
            success: true,
            result: websiteSetting,
            httpMethodCode: 201,
            messages: [new ResponseMessage({
                eventId: 204,
                type: ResponseMessageType.info,
                message: messages['WEBSITESETTING_ADDED']
            })]
        });
    } catch (error) {
        logger.error(`Adding WebsiteSetting failed >\n ${error}`);

        return new ServiceResult({
            success: false,
            httpMethodCode: 500,
            exception: error,
            messages: [
                new ResponseMessage({
                    eventId: 205,
                    type: ResponseMessageType.error,
                    message: messages['INTERNAL_SERVER_ERROR']
                })
            ]
        });
    }

}

/**
 * @method getWebsiteSetting method for getting WebsiteSetting
 * @returns {ServiceResult} - A Result for this method
 */
async function getWebsiteSettingGuest() {
    try {
        let websiteSetting = await WebsiteSetting.find({});
        if (websiteSetting.length === 0) {
            logger.error('No WebsiteSettings found');

            let addWebsiteSettingResult = await addWebsiteSetting({});
            if (addWebsiteSettingResult.success) {
                websiteSetting = addWebsiteSettingResult.result;
            } else {
                throw addWebsiteSettingResult.exception;
            }
        } else {
            websiteSetting = websiteSetting[0];
        }
        logger.info('WebsiteSetting found');
        let detailWebsiteSettingGuestApiModel = new DetailWebsiteSettingGuestApiModel(websiteSetting);

        return new ServiceResult({
            result: detailWebsiteSettingGuestApiModel,
            success: true,
            httpMethodCode: 200,
            messages: [
                new ResponseMessage({
                    eventId: 206,
                    type: ResponseMessageType.info,
                    message: messages['WEBSITE_SETTING_FOUND']
                })
            ]
        });

    } catch (error) {
        logger.error(`Getting WebsiteSetting for Guest failed >\n ${error.stack}`);

        return new ServiceResult({
            success: false,
            httpMethodCode: 500,
            messages: [
                new ResponseMessage({
                    eventId: 207,
                    type: ResponseMessageType.error,
                    message: messages['INTERNAL_SERVER_ERROR']
                })
            ]
        });
    }
}

module.exports = {
    getWebsiteSetting,
    updateWebsiteSetting,
    getWebsiteSettingGuest
};
