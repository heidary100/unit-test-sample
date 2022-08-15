const ResponseResult = require('../api-models/ResponseResult');

// Service functions
const websiteSettingManager = require('../services/website-setting-manager-service');

async function getWebsiteSetting(req, res) {
    let result = await websiteSettingManager.getWebsiteSettingGuest();

    const responseResult = new ResponseResult(result);

    res.status(result.httpMethodCode).send(responseResult);
}

module.exports = {
    getWebsiteSetting
};
